var url = require('url');
console.log('tes');
document.body.innerHTML = JSON.stringify(url.parse(window.location.href));
