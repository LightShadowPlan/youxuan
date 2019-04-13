/**
 * Created by qiangxl on 2019/3/9.
 */
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "QQ",
  auth: {
    user: "2136506491@qq.com",
    pass: "uukxgvxrakavfdbe"
  }
});


const sendMail = (addressee, content) => {
  let mailOptions = {
    from: "2136506491@qq.com", // 发送者
    to: addressee, // 接受者,可以同时发送多个,以逗号隔开
    subject: content.title, // 标题
    text: content.text, // 文本
    html: content.html,
    attachments: content.attachments//附件
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("success");
  });
}

const verificationMail = (addressee,content) => {
  let mailOptions = {
    from: "2136506491@qq.com", // 发送者
    to: addressee, // 接受者,可以同时发送多个,以逗号隔开
    subject: "优选商城管理系统账号注册验证", // 标题
    text: "获取验证码", // 文本
    html: `
        <style>p{height: 40px;line-height: 40px;font-size: 18px;}</style>
        <p>你好 ${addressee}</p>
        <p>欢迎加入优选商城，请将验证码填写到注册页面。</p> 
        <p>验证码：${content}</p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return;
    }
    console.log("success");
  });
}

//随机验证码
const verificationCode = () => {
  let randomNum1 = '' + parseInt(Math.random()*900+100);
  let randomNum2 = '' + parseInt(Math.random()*900+100);
  return Number(randomNum1 + randomNum2)
}

module.exports = {
  sendMail,
  verificationMail,
  verificationCode
}