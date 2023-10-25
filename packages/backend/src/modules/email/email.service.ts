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

  async send(email: string) {
    const mail = {
      from: '""<xxxxxx@qq.com>', // 发件人
      subject: 'subject', // 邮箱主题
      to: email, // 收件人，这里由post请求传递过来
      // 邮件内容，用html格式编写
      html: `
            <p>您好！</p>
            <p>您的验证码是：<strong style="color:orangered;"></strong></p>
            <p>如果不是您本人操作，请无视此邮件</p>
        `,
    }
    await this.mailer.sendMail(mail)
  }
}
