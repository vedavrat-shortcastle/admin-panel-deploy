import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  console.log('email', email);
  console.log('otp', otp);
  const msg = {
    to: 'vedavrat@shortcastle.com',
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Login Verification Code',
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid Error:', error);
    throw new Error('Failed to send OTP email');
  }
}
