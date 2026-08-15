import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD, 
  },
});

const sendVerificationEmail = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
    
      from: `"designO" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: `${otp} is your verification code`,
      
      text: `Hello,

Your verification code is: ${otp}

This code will expire in 5 minutes. If you did not request this code, no further action is required and you can safely ignore this email.

Thanks,
 Team designO`,
   
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verification Code</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="margin-top: 0; color: #111827; font-size: 20px;">Verify your account</h2>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Use the following one-time password (OTP) to complete your verification:</p>
                  
                  <div style="background-color: #f3f4f6; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #2563eb;">${otp}</span>
                  </div>

                  <p style="font-size: 13px; line-height: 1.5; color: #6b7280; margin-bottom: 0;">
                    This code will expire in 5 minutes. If you did not request this, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return info.accepted.length > 0;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default sendVerificationEmail;