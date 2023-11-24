import nodemailer from 'nodemailer'
export class EmailService {
  mailer = nodemailer.createTransport({
    service: 'qq', // 类型qq邮箱
    port: 465, // 上文获取的port
    secure: true, // 上文获取的secure
    auth: {
      user: process.env.EMAIL, // 发送方的邮箱，可以选择你自己的qq邮箱
      pass: process.env.EMAIL_STMP, // 上文获取的stmp授权码
    },
  })

  async send(title: string, email: string, content: string) {
    const mail = {
      from: process.env.EMAIL, // 发件人
      subject: title, // 邮箱主题
      to: email, // 收件人，这里由post请求传递过来
      // 邮件内容，用html格式编写
      html: content,
    }
    await this.mailer.sendMail(mail)
  }
}
