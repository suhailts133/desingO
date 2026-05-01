import nodemailer from "nodemailer";

const sendVerificationEmail = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL as string,
        pass: process.env.NODEMAILER_PASSWORD as string,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Verify Your Account",
      text: `Dear User,
Your One-Time Password (OTP) for verifying your account is ${otp}.
Please enter this OTP on the verification page to complete the process.
Do not share this code with anyone.`,
      html: `
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h2>${otp}</h2>
        <p>Please do not share this code with anyone.</p>
      `,
    });

    return info.accepted.length > 0;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendVerificationEmail;