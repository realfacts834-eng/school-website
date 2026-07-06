import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ڈیفالٹ ایڈریس
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "School Website <noreply@afridischool.edu.pk>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@afridischool.edu.pk";

// ==========================================
// ای میل بھیجنے کا فنکشن
// ==========================================
interface SendEmailProps {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail({ to, subject, html, from, replyTo, attachments }: SendEmailProps) {
  try {
    const data = await resend.emails.send({
      from: from || DEFAULT_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo,
      attachments,
    });

    if (data.error) {
      console.error("❌ Email send error:", data.error);
      return { success: false, error: data.error };
    }

    console.log(`✅ Email sent to: ${Array.isArray(to) ? to.join(", ") : to}`);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ==========================================
// ای میل ٹیمپلیٹس
// ==========================================
interface EmailTemplateProps {
  schoolName?: string;
  schoolLogo?: string;
  schoolEmail?: string;
  schoolPhone?: string;
}

// میل ہیلپر
function emailWrapper(content: string, props: EmailTemplateProps = {}): string {
  const {
    schoolName = "Afridi Model School & College",
    schoolLogo,
    schoolEmail = "info@afridischool.edu.pk",
    schoolPhone = "+92 300 1234567",
  } = props;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%); padding: 30px; text-align: center;">
          ${schoolLogo ? `<img src="${schoolLogo}" alt="${schoolName}" style="max-height: 60px; margin-bottom: 10px;" />` : ""}
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">${schoolName}</h1>
          <p style="color: #94a3b8; margin: 5px 0 0; font-size: 14px;">Building Future Leaders</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 3px solid #D4AF37;">
          <p style="color: #64748b; font-size: 13px; margin: 0 0 5px;">
            ${schoolName}
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            📧 ${schoolEmail} &nbsp;|&nbsp; 📞 ${schoolPhone}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// 1. کانٹیکٹ فارم ای میل (ایڈمن کو)
// ==========================================
export function contactEmailTemplate(
  name: string,
  email: string,
  phone: string | null,
  subject: string,
  message: string,
  props?: EmailTemplateProps
) {
  const schoolName = props?.schoolName || "Afridi Model School & College";

  const content = `
    <div style="border-left: 4px solid #3B82F6; padding-left: 16px; margin-bottom: 24px;">
      <h2 style="color: #0F172A; margin: 0 0 8px; font-size: 20px;">📬 New Contact Message</h2>
      <p style="color: #64748b; margin: 0; font-size: 14px;">Received on ${new Date().toLocaleString()}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155; width: 100px;">Name:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Email:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">
          <a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a>
        </td>
      </tr>
      ${phone ? `
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Phone:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${phone}</td>
      </tr>
      ` : ""}
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Subject:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${subject}</td>
      </tr>
    </table>

    <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="font-weight: bold; color: #92400e; margin: 0 0 8px;">Message:</p>
      <p style="color: #78350f; margin: 0; line-height: 1.6;">${message}</p>
    </div>

    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
       style="display: inline-block; background: #3B82F6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      ✉️ Reply to ${name}
    </a>
  `;

  return emailWrapper(content, props);
}

// ==========================================
// 2. ایڈمیشن کنفرمیشن ای میل (پیرنٹ کو)
// ==========================================
export function admissionEmailTemplate(
  studentName: string,
  className: string,
  fatherName: string,
  props?: EmailTemplateProps
) {
  const schoolName = props?.schoolName || "Afridi Model School & College";

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 48px; margin-bottom: 12px;">🎓</div>
      <h2 style="color: #0F172A; margin: 0; font-size: 22px;">Application Received!</h2>
    </div>

    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
      Dear <strong>${fatherName}</strong>,
    </p>

    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
      Thank you for applying to <strong>${schoolName}</strong>. We have received the admission application for:
    </p>

    <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
      <p style="font-size: 20px; font-weight: bold; color: #166534; margin: 0;">${studentName}</p>
      <p style="font-size: 16px; color: #15803d; margin: 5px 0 0;">Applying for: <strong>${className}</strong></p>
    </div>

    <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="color: #1e40af; margin: 0 0 12px; font-size: 16px;">📋 What's Next?</h3>
      <ol style="color: #3b82f6; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Our admission team will review your application</li>
        <li>You will receive a confirmation call within 2-3 working days</li>
        <li>An entrance test/interview date will be scheduled (if applicable)</li>
        <li>Final admission decision will be communicated via phone/email</li>
      </ol>
    </div>

    <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 24px;">
      For any queries, please contact us:<br/>
      📞 ${props?.schoolPhone || "+92 300 1234567"} &nbsp;|&nbsp; 
      📧 ${props?.schoolEmail || "info@afridischool.edu.pk"}
    </p>
  `;

  return emailWrapper(content, props);
}

// ==========================================
// 3. ایڈمیشن نوٹیفکیشن (ایڈمن کو)
// ==========================================
export function admissionNotificationTemplate(
  studentName: string,
  className: string,
  fatherName: string,
  phone: string,
  props?: EmailTemplateProps
) {
  const schoolName = props?.schoolName || "Afridi Model School & College";

  const content = `
    <div style="border-left: 4px solid #10B981; padding-left: 16px; margin-bottom: 24px;">
      <h2 style="color: #0F172A; margin: 0 0 8px; font-size: 20px;">🎓 New Admission Application</h2>
      <p style="color: #64748b; margin: 0; font-size: 14px;">Received on ${new Date().toLocaleString()}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155; width: 130px;">Student Name:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${studentName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Father Name:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${fatherName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Class:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${className}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Phone:</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #475569;">${phone}</td>
      </tr>
    </table>

    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/admissions" 
       style="display: inline-block; background: #10B981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      📋 View All Applications
    </a>
  `;

  return emailWrapper(content, props);
}

// ==========================================
// 4. نیوزلیٹر ویلکم ای میل
// ==========================================
export function subscriberWelcomeTemplate(
  email: string,
  props?: EmailTemplateProps
) {
  const schoolName = props?.schoolName || "Afridi Model School & College";

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 48px; margin-bottom: 12px;">📧</div>
      <h2 style="color: #0F172A; margin: 0; font-size: 22px;">Welcome to Our Newsletter!</h2>
    </div>

    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
      Thank you for subscribing to the <strong>${schoolName}</strong> newsletter!
    </p>

    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
      You will now receive:
    </p>

    <ul style="color: #475569; font-size: 15px; line-height: 1.8;">
      <li>📰 Latest school news and announcements</li>
      <li>📅 Upcoming events and activities</li>
      <li>🏆 Student achievements and results</li>
      <li>📝 Important notices and dates</li>
    </ul>

    <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 24px;">
      If you wish to unsubscribe, please contact us at<br/>
      📧 ${props?.schoolEmail || "info@afridischool.edu.pk"}
    </p>
  `;

  return emailWrapper(content, props);
}

// ==========================================
// 5. جنرل ای میل ٹیمپلیٹ
// ==========================================
export function generalEmailTemplate(
  title: string,
  body: string,
  props?: EmailTemplateProps
) {
  const content = `
    <h2 style="color: #0F172A; margin: 0 0 16px; font-size: 20px;">${title}</h2>
    <div style="color: #475569; font-size: 16px; line-height: 1.6;">
      ${body}
    </div>
  `;

  return emailWrapper(content, props);
}