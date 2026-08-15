import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ensureError } from "../errors/ensureError";

dotenv.config();

const getTransporter = () => {
  const user = process.env.NODEMAILER_EMAIL;
  const pass = process.env.NODEMAILER_PASSWORD;

  if (!user || !pass) {
    throw new Error("NODEMAILER_EMAIL or NODEMAILER_PASSWORD is not defined in environment variables.");
  }

  return {
    user,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    }),
  };
};

export const sendDesignerVerificationEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  try {
    const { user, transporter } = getTransporter();

    const info = await transporter.sendMail({
      from: `"designO" <${user}>`,
      to: email,
      subject: "Designer Application Received - designO",
      text: `Hello ${name},

Thank you for submitting your designer application on designO.
We have received your application and it is currently under review.
Our team will verify your details and get back to you shortly.

Please do not submit another application while this one is under review.

Best regards,
The designO Team`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Application Received</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="margin-top: 0; color: #111827;">Application Received</h2>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Hello <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Thank you for submitting your designer application on <strong>designO</strong>.</p>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">We have received your details and your profile is currently <strong>under review</strong>. Our team will verify your submission and update you shortly.</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                  <p style="color: #6b7280; font-size: 13px; margin: 0;">Please do not submit another application while this one is under review.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return info.accepted.length > 0;
  } catch (error) {
    const err = ensureError(error).message;
    console.error("Error sending designer verification email:", err);
    return false;
  }
};

export const sendDesignerStatusEmail = async (
  email: string,
  name: string,
  status: "Approved" | "Rejected",
  rejectionReason?: string
): Promise<boolean> => {
  try {
    const { user, transporter } = getTransporter();
    const isApproved = status === "Approved";

    const subject = isApproved
      ? "Congratulations! Your Designer Application is Approved - designO"
      : "Update on Your Designer Application - designO";

    const text = isApproved
      ? `Hello ${name},\n\nCongratulations! Your designer application on designO has been approved.\nYou can now log in and access all designer features on the platform.\n\nWelcome aboard!\nThe designO Team`
      : `Hello ${name},\n\nThank you for your interest in designO. After reviewing your application, we regret to inform you that it has not been approved at this time.\n\nReason: ${rejectionReason || "Criteria requirements were not met."}\n\nYou may reapply after addressing the above concern.\n\nThe designO Team`;

    const html = isApproved
      ? `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Application Approved</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="margin-top: 0; color: #16a34a;">Application Approved 🎉</h2>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Hello <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Congratulations! Your designer application on <strong>designO</strong> has been <strong style="color: #16a34a;">approved</strong>.</p>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">You can now log in to access all designer tools, upload works, and participate in projects.</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                  <p style="color: #6b7280; font-size: 13px; margin: 0;">Please log in again to continue as a verified designer.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Application Update</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="margin-top: 0; color: #dc2626;">Application Status Update</h2>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">Hello <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; line-height: 1.5; color: #4b5563;">We regret to inform you that your designer application on <strong>designO</strong> was not approved.</p>
                  
                  <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #991b1b;">Reason for Rejection:</p>
                    <p style="margin: 6px 0 0; font-size: 14px; color: #7f1d1d;">${rejectionReason || "Criteria requirements were not met."}</p>
                  </div>
                  
                  <p style="font-size: 14px; color: #4b5563;">You are welcome to reapply after resolving the issues mentioned above.</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">If you believe this was a mistake, please contact our support team.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

    const info = await transporter.sendMail({
      from: `"designO" <${user}>`,
      to: email,
      subject,
      text,
      html,
    });

    return info.accepted.length > 0;
  } catch (error) {
    const err = ensureError(error).message;
    console.error("Error sending designer status email:", err);
    return false;
  }
};