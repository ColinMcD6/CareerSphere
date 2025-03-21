import resend from "../../config/resend";
import { NODE_ENV } from "../../constants/env";

type emailParams = {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const getToEmail = (to: string) =>
    NODE_ENV === "dev" || NODE_ENV === "test" ? "delivered@resend.dev" : to;

export const sendEmail = async (
    {
        to, subject, text, html
    }:emailParams
) => 
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: getToEmail(to),
        subject,
        text,
        html
    });