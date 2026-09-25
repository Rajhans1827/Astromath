import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Create Nodemailer Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback to test/console logger if SMTP credentials are blank
  return null;
};

// Generate secure 6-digit numeric OTP
export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP via Nodemailer
export async function sendOtpEmail(email, otpCode, userName = 'Cosmic Traveler') {
  const transporter = createTransporter();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #030712; color: #F1F5F9; padding: 40px 20px; border-radius: 16px; max-width: 500px; margin: auto;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #F59E0B; margin: 0; font-size: 28px; letter-spacing: 2px;">ASTROMATH</h1>
        <p style="color: #94A3B8; font-size: 13px; margin: 5px 0 0 0;">AI-Powered Vedic Astrology Platform</p>
      </div>

      <div style="background-color: #0F172A; border: 1px solid #1E293B; border-radius: 12px; padding: 25px; text-align: center;">
        <p style="font-size: 15px; margin: 0 0 15px 0; color: #E2E8F0;">नमस्कार, <strong>${userName}</strong>!</p>
        <p style="font-size: 13px; color: #94A3B8; margin: 0 0 20px 0;">
          तुमचे AstroMath अकाउंट सुरू करण्यासाठी खालील ६-अंकी पडताळणी कोड (OTP) वापरा:
        </p>

        <div style="background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(139,92,246,0.15)); border: 1px solid #F59E0B; border-radius: 10px; padding: 15px 25px; display: inline-block; margin: 10px auto;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #FDE68A;">${otpCode}</span>
        </div>

        <p style="font-size: 12px; color: #64748B; margin: 20px 0 0 0;">
          हा OTP पुढील १० मिनिटांसाठी वैध आहे. हा कोड कोणासोबतही शेअर करू नका.
        </p>
      </div>

      <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #475569;">
        © 2026 AstroMath. Swiss Ephemeris & Gemini AI Vedic Intelligence.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      const from = process.env.SMTP_FROM || 'AstroMath <auth@astromath.ai>';
      await transporter.sendMail({
        from,
        to: email,
        subject: `[AstroMath] तुमचा पडताळणी कोड: ${otpCode}`,
        text: `तुमचा AstroMath OTP कोड: ${otpCode} (वैध: 10 मिनिटे)`,
        html: htmlContent,
      });
      console.log(`[Nodemailer] Successfully sent OTP email to: ${email}`);
      return { success: true };
    } catch (err) {
      console.error('[Nodemailer Error]', err);
      // Fallback to console output
      console.log(`\n========================================`);
      console.log(`[DEV OTP NOTIFICATION] Email: ${email}`);
      console.log(`[DEV OTP CODE]: >>> ${otpCode} <<<`);
      console.log(`========================================\n`);
      return { success: true, simulated: true };
    }
  } else {
    // Development Mode Console Output
    console.log(`\n======================================================`);
    console.log(`🌌 [AstroMath OTP] User: ${userName} (${email})`);
    console.log(`🔑 [VERIFICATION OTP CODE]: >>> ${otpCode} <<<`);
    console.log(`(Configure SMTP_USER & SMTP_PASSWORD in .env for live email delivery)`);
    console.log(`======================================================\n`);
    return { success: true, simulated: true };
  }
}
