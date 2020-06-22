const http = require('http');
const nodemailer = require('nodemailer');
let response;
let request;


/** 創建Server */
http.createServer(function (req, res) {
  response = res;
  request = req;
  request.setEncoding('utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  response.setHeader('Access-Control-Allow-Headers', '*');

  if (request.method == 'POST') {
    let body = '';
    /** 取得全部請求資料 */
    request.on('data', function (data) {
      body += data
      console.log('Accept request!')
    })
    /** 進行資料傳輸 */
    request.on('end', function () {
      /** 轉換為JSON格式 */
      const jsonBody = JSON.parse(body);
      sendMail(jsonBody.acceptMail, jsonBody.title, jsonBody.content);
    })
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('options received')
  }


}).listen(3000);
console.log("--HTTP NodeJS Connect--");

/**
 *
 * 寄出信件
 * @param {*} acceptMail 要接收的信箱
 * @param {*} title 標題
 * @param {*} content 內容
 */
function sendMail(acceptMail, title, content) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'a1104108129@gmail.com',
      pass: 'fdzoutpgivnchdnw',
    }, tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'a1104108129@gmail.com',
    to: acceptMail,
    subject: title,
    text: content
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end('Internal Server Error');
      console.log(error);
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end('mail is sent.');
      console.log('Email sent: ' + info.response);
    }
  });
}
