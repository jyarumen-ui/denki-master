const qr = require('qrcode');
const fs = require('fs');
const url = 'exp://192.168.2.110:8081';
qr.toDataURL(url, { width: 400, margin: 2 }, (e, dataUrl) => {
  const html = `<!DOCTYPE html>
<html>
<body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#1a1a2e;margin:0">
  <h2 style="color:#FFD700;margin-bottom:16px">⚡ でんき学習アプリ</h2>
  <div style="background:white;padding:16px;border-radius:12px">
    <img src="${dataUrl}" style="display:block" />
  </div>
  <p style="color:white;margin-top:16px;font-size:14px">${url}</p>
  <p style="color:#aaa;font-size:12px">Expo Go アプリで読み取ってください</p>
</body>
</html>`;
  fs.writeFileSync('qr.html', html);
  console.log('done');
});
