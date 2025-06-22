const fs = require('fs');
const path = require('path');

// 既存のアイコンファイルをコピーしてfaviconとして使用
const sourceIcon = path.join(__dirname, '../public/icon.png');
const favicon16 = path.join(__dirname, '../public/favicon-16x16.png');
const favicon32 = path.join(__dirname, '../public/favicon-32x32.png');
const faviconIco = path.join(__dirname, '../public/favicon.ico');

// アイコンファイルをコピー
try {
  // 16x16と32x32のfaviconとして同じアイコンを使用
  fs.copyFileSync(sourceIcon, favicon16);
  fs.copyFileSync(sourceIcon, favicon32);
  
  // favicon.icoも同じアイコンを使用（ブラウザが自動的にリサイズする）
  fs.copyFileSync(sourceIcon, faviconIco);
  
  console.log('✅ Favicon files generated successfully!');
  console.log('📁 Generated files:');
  console.log('   - /public/favicon-16x16.png');
  console.log('   - /public/favicon-32x32.png');
  console.log('   - /public/favicon.ico');
} catch (error) {
  console.error('❌ Error generating favicon files:', error);
  process.exit(1);
} 