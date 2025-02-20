import resend from "../../config/resend";

type emailParams = {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const sendEmail = async (
    {
        to, subject, text, html
    }:emailParams
) => 
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: to,
        subject,
        text,
        html
    });