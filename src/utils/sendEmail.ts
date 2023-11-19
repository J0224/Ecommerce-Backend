import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
const asyncHandler = require ("express-async-handler")

dotenv.config();

const sendgridApiKey: string | undefined = process.env.SENDGRID_API_KEY;

if (!sendgridApiKey) {
  throw new Error("SENDGRID_API_KEY is not defined in the environment variables.");
}

sgMail.setApiKey(sendgridApiKey);

const sendEmail =  asyncHandler (  async (
  subject: string,
  message: string,
  send_to?: string,
  sent_from?: string,
  reply_to?: string
): Promise<void> => {
  const to = send_to || "";
  const from = sent_from || "";
  const replyTo = reply_to || sent_from || ""; // Use sent_from as reply_to if not provided separately

  const msg = {
    to,
    from,
    replyTo,
    subject,
    html: message,
  };

  try {
    const info = await sgMail.send(msg);
    console.log(info);
  } catch (error: any) {
    console.log("SendGrid Error:", error.response?.body);
  }
});

export default sendEmail;
