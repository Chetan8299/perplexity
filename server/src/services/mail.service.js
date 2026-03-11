import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
    }
})

transporter.verify((error) => {
    if (error) {
        console.log("Error verifying transporter: ", error);
    } else {
        console.log("Transporter verified successfully");
    }
})

/**
 * Send email to the user
 * @param {string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {string} html - The HTML content of the email
 * @param {string} text - The text content of the email
 */
export const sendEmail = async (to, subject, html, text) => {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html: html ? html : text,
        text: text ? text : null,
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (error) {
        console.log("Error sending email: ", error);
    }
}