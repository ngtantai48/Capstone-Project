require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Nguyễn Tấn Tài 👻" <taitynguyen123@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName},</h3>
            <p>Bạn nhận được email này vì bạn đã thực hiện đặt lịch khám bệnh online trên Booking Care.</p>
            <p>Thông tin đặt lịch</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

            <p>
                <i>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</i>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </p>
            
            <p>Xin chân thành cảm ơn!</p>
        `
    }

    if (dataSend.language === 'en') {
        result = `
            <h3>Dear ${dataSend.patientName},</h3>
            <p>You received this email because you made an online appointment on Booking Care.</p>
            <p>Booking information</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>

            <p>
                <i>If the above information is correct, please click on the link below to confirm and complete the appointment procedure.</i>
                <a href=${dataSend.redirectLink} target="_blank">Click here</a>
            </p>

            <p>Sincerely thank!</p>
        `
    }

    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}