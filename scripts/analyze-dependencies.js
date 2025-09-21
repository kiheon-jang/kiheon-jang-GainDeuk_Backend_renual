#!/usr/bin/env node

/**
 * 의존성 분석 스크립트
 * 미사용 종속성을 찾아서 제거 제안
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 프로젝트 루트 디렉토리
const projectRoot = process.cwd();
const packageJsonPath = path.join(projectRoot, 'package.json');
const nodeModulesPath = path.join(projectRoot, 'node_modules');

// package.json 읽기
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// 소스 코드에서 import/require 패턴 찾기
function findImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // ES6 import 패턴
    const es6Imports = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
    es6Imports.forEach(imp => {
      const match = imp.match(/from\s+['"]([^'"]+)['"]/);
      if (match) {
        imports.push(match[1]);
      }
    });
    
    // CommonJS require 패턴
    const requireImports = content.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || [];
    requireImports.forEach(req => {
      const match = req.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        imports.push(match[1]);
      }
    });
    
    // 동적 import 패턴
    const dynamicImports = content.match(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || [];
    dynamicImports.forEach(imp => {
      const match = imp.match(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      if (match) {
        imports.push(match[1]);
      }
    });
    
    return imports;
  } catch (error) {
    return [];
  }
}

// 디렉토리 재귀적으로 탐색
function findImportsInDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const imports = new Set();
  
  function traverse(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // node_modules, .git 등 제외
          if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist' && item !== 'build') {
            traverse(itemPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            const fileImports = findImportsInFile(itemPath);
            fileImports.forEach(imp => imports.add(imp));
          }
        }
      });
    } catch (error) {
      // 권한 오류 등 무시
    }
  }
  
  traverse(dirPath);
  return Array.from(imports);
}

// 패키지명 정규화
function normalizePackageName(importPath) {
  // scoped package 처리 (@scope/package)
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importPath;
  }
  
  // 일반 패키지 처리
  return importPath.split('/')[0];
}

// 의존성 분석 실행
function analyzeDependencies() {
  console.log('🔍 의존성 분석을 시작합니다...\n');
  
  // 소스 코드에서 사용되는 import 찾기
  const srcPath = path.join(projectRoot, 'src');
  const usedImports = findImportsInDirectory(srcPath);
  
  // 패키지명으로 정규화
  const usedPackages = new Set();
  usedImports.forEach(imp => {
    const packageName = normalizePackageName(imp);
    if (packageName && !imp.startsWith('.')) {
      usedPackages.add(packageName);
    }
  });
  
  // package.json의 의존성과 비교
  const unusedDependencies = [];
  const missingDependencies = [];
  
  Object.keys(dependencies).forEach(dep => {
    if (!usedPackages.has(dep)) {
      unusedDependencies.push(dep);
    }
  });
  
  usedPackages.forEach(pkg => {
    if (!dependencies[pkg]) {
      missingDependencies.push(pkg);
    }
  });
  
  // 결과 출력
  console.log('📊 분석 결과:\n');
  
  console.log(`✅ 사용 중인 패키지: ${usedPackages.size}개`);
  console.log(`❌ 미사용 패키지: ${unusedDependencies.length}개`);
  console.log(`⚠️  누락된 패키지: ${missingDependencies.length}개\n`);
  
  if (unusedDependencies.length > 0) {
    console.log('🗑️  제거 가능한 의존성:');
    unusedDependencies.forEach(dep => {
      const version = dependencies[dep];
      console.log(`  - ${dep}@${version}`);
    });
    console.log('');
  }
  
  if (missingDependencies.length > 0) {
    console.log('📦 추가 필요한 의존성:');
    missingDependencies.forEach(dep => {
      console.log(`  - ${dep}`);
    });
    console.log('');
  }
  
  // 제거 명령어 생성
  if (unusedDependencies.length > 0) {
    console.log('💡 제거 명령어:');
    console.log(`npm uninstall ${unusedDependencies.join(' ')}\n`);
  }
  
  // 번들 크기 분석
  try {
    console.log('📦 번들 크기 분석:');
    execSync('npm run build', { stdio: 'pipe' });
    
    const distPath = path.join(projectRoot, 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath, { recursive: true });
      let totalSize = 0;
      
      files.forEach(file => {
        const filePath = path.join(distPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          totalSize += stat.size;
        }
      });
      
      console.log(`  총 번들 크기: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    }
  } catch (error) {
    console.log('  번들 크기 분석 실패:', error.message);
  }
  
  // 최적화 제안
  console.log('\n🚀 최적화 제안:');
  
  if (unusedDependencies.length > 0) {
    console.log('  1. 미사용 의존성 제거');
  }
  
  console.log('  2. Tree shaking 최적화 확인');
  console.log('  3. 번들 분석 도구 사용 (npm run analyze)');
  console.log('  4. 코드 스플리팅 적용');
  console.log('  5. 이미지 최적화 (WebP, AVIF)');
  
  return {
    usedPackages: Array.from(usedPackages),
    unusedDependencies,
    missingDependencies
  };
}

// 스크립트 실행
if (require.main === module) {
  try {
    const result = analyzeDependencies();
    
    // 결과를 파일로 저장
    const resultPath = path.join(projectRoot, 'dependency-analysis.json');
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
    console.log(`\n📄 분석 결과가 ${resultPath}에 저장되었습니다.`);
    
  } catch (error) {
    console.error('❌ 분석 중 오류 발생:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeDependencies };
