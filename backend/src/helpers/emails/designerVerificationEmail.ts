import nodemailer from "nodemailer";
import { ensureError } from "../errors/ensureError.js";

export const sendDesignerVerificationEmail = async (
    email: string,
    name: string
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
            subject: "Designer Application Received - designO",
            text: `Dear ${name},
Thank you for submitting your designer application on designO.
We have received your application and it is currently under review.
Our team will verify your details and get back to you shortly.
Please do not submit another application while this one is under review.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Application Received</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Thank you for submitting your designer application on <strong>designO</strong>.</p>
                    <p>We have received your application and it is currently <strong>under review</strong>.</p>
                    <p>Our team will verify your details and get back to you shortly.</p>
                    <br/>
                    <p style="color: #888; font-size: 12px;">Please do not submit another application while this one is under review.</p>
                </div>
            `,
        });

        return info.accepted.length > 0;
    } catch (error) {
        const err = ensureError(error).message
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

        const isApproved = status === "Approved";

        const subject = isApproved
            ? "Congratulations! Your Designer Application is Approved - designO"
            : "Update on Your Designer Application - designO";

        const text = isApproved
            ? `Dear ${name},\n\nCongratulations! Your designer application on designO has been approved.\nYou can now access all designer features on the platform.\n\nWelcome aboard!`
            : `Dear ${name},\n\nWe regret to inform you that your designer application on designO has been rejected.\n\nReason: ${rejectionReason}\n\nYou may reapply after addressing the above concern.`;

        const html = isApproved
            ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Application Approved </h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Congratulations! Your designer application on <strong>designO</strong> has been <strong style="color: #4CAF50;">approved</strong>.</p>
                    <p>You can now access all designer features on the platform.</p>
                    <br/>
                    <p>Welcome aboard!</p>
                    <p>Please <strong>login</strong again to continue as a designer.</p>
                </div>
            `
            : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #f44336;">Application Rejected</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>We regret to inform you that your designer application on <strong>designO</strong> has been <strong style="color: #f44336;">rejected</strong>.</p>
                    <div style="background-color: #fff3f3; border-left: 4px solid #f44336; padding: 12px; margin: 16px 0;">
                        <p style="margin: 0;"><strong>Reason for Rejection:</strong></p>
                        <p style="margin: 8px 0 0;">${rejectionReason}</p>
                    </div>
                    <p>You may reapply after addressing the above concern.</p>
                    <br/>
                    <p style="color: #888; font-size: 12px;">If you believe this was a mistake, please contact our support team.</p>
                </div>
            `;

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
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

export default sendDesignerStatusEmail;