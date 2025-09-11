require("dotenv").config();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact Message: ${subject}`,
      text: `You have received a new message from ${name} (${email}).\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555;">
            ${message}
          </blockquote>
          <hr/>
          <p style="font-size: 12px; color: #777;">This email was sent via your website contact form.</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });
  }catch (error) {
    console.error("Error sending contact:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    if (!contacts) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, error: "Failed to fetch contacts" });
  }
};

module.exports = {
  sendContact,
  getContacts,
};
