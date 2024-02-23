import nodemailer from 'nodemailer';

const sendMail= async(email)=>{
    let otp = '';
        for (let i = 0; i < 6; i++) {
          otp += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
        }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mybothelper99@gmail.com',
          pass: 'vuhh swka gbye ldxg'
        }
      });
    
      const mailOptions = {
        from: 'mybothelper99@gmail.com',
        to: email,
        subject: 'Interniee verify email',
        text:` Hello, your OTP is ${otp}`
      };
    
      try {
        await transporter.sendMail(mailOptions);
        return otp
      } catch (error) {
        console.log(error.message);
        return false
      }
}

export {
    sendMail
}