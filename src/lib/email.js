import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create a transporter for sending emails
// For development, you can use services like Gmail, SendGrid, or Mailgun
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Generate a verification token
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Send verification email
export async function sendVerificationEmail(email, name, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email address - SQL Learn',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to SQL Learn!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with SQL Learn. To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
        
        <p>This link will expire in 24 hours.</p>
        
        <p>If you didn't create an account with SQL Learn, you can safely ignore this email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated email from SQL Learn. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// For development/testing purposes, you can also create a mock email sender
export async function sendMockVerificationEmail(email, name, token) {
  console.log('=== MOCK EMAIL SENT ===');
  console.log('To:', email);
  console.log('Subject: Verify your email address - SQL Learn');
  console.log('Verification URL:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`);
  console.log('======================');
  return true;
} 