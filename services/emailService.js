const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email to admin when form is submitted
 */
async function sendAdminNotification(submission) {
  if (process.env.SEND_EMAIL_NOTIFICATIONS !== 'true') {
    console.log('Email notifications disabled');
    return;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email credentials not configured in .env');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${submission.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${submission.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
      <p><strong>Subject:</strong> ${submission.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${submission.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submission ID: ${submission._id || 'N/A'}</small></p>
      <p><small>Submitted at: ${new Date(submission.createdAt).toLocaleString()}</small></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification sent to:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
}

/**
 * Send confirmation email to user
 */
async function sendUserConfirmation(submission) {
  if (process.env.SEND_EMAIL_NOTIFICATIONS !== 'true') {
    return;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: submission.email,
    subject: 'We received your message - Grace Bites',
    html: `
      <h2>Thank you for contacting Grace Bites!</h2>
      <p>Hi ${submission.name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <hr>
      <p><strong>Your Message Details:</strong></p>
      <p><strong>Subject:</strong> ${submission.subject}</p>
      <p><strong>Submitted on:</strong> ${new Date(submission.createdAt).toLocaleString()}</p>
      <hr>
      <p>Best regards,<br>Grace Bites Team</p>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('User confirmation sent to:', submission.email);
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
  }
}

module.exports = {
  sendAdminNotification,
  sendUserConfirmation
};
