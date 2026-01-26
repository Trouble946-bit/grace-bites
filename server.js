const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const ContactSubmission = require('./models/ContactSubmission');
const { sendAdminNotification, sendUserConfirmation } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// In-memory fallback storage (if database unavailable)
const submissionsMemory = [];

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✓ Connected to MongoDB');
    } else {
      console.log('⚠ MONGODB_URI not configured. Using in-memory storage.');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('⚠ Using in-memory storage for submissions');
  }
};

connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    emailNotifications: process.env.SEND_EMAIL_NOTIFICATIONS === 'true' ? 'Enabled' : 'Disabled'
  });
});

// Form submission endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required' 
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name must be at least 2 characters' 
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide a valid email address' 
    });
  }

  if (subject.trim().length < 3) {
    return res.status(400).json({ 
      success: false, 
      error: 'Subject must be at least 3 characters' 
    });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ 
      success: false, 
      error: 'Message must be at least 10 characters' 
    });
  }

  try {
    let submission;

    // Try to save to MongoDB first
    if (mongoose.connection.readyState === 1) {
      submission = await ContactSubmission.create({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      console.log('Submission saved to MongoDB:', submission._id);
    } else {
      // Fallback to memory storage
      submission = {
        id: submissionsMemory.length + 1,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        _id: `mem-${submissionsMemory.length + 1}`
      };
      submissionsMemory.push(submission);
      console.log('Submission saved to memory:', submission.id);
    }

    // Send emails
    await sendAdminNotification(submission);
    await sendUserConfirmation(submission);

    res.status(201).json({ 
      success: true, 
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
      submissionId: submission._id || submission.id
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred. Please try again later.' 
    });
  }
});

// Get all submissions (admin endpoint)
app.get('/api/submissions', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        count: submissions.length,
        source: 'MongoDB',
        submissions: submissions
      });
    } else {
      res.json({
        success: true,
        count: submissionsMemory.length,
        source: 'Memory',
        submissions: submissionsMemory
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve submissions' 
    });
  }
});

// Get specific submission
app.get('/api/submissions/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const submission = await ContactSubmission.findById(req.params.id);
      
      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          error: 'Submission not found' 
        });
      }
      
      res.json({ success: true, submission });
    } else {
      const submission = submissionsMemory.find(s => s.id === parseInt(req.params.id));
      
      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          error: 'Submission not found' 
        });
      }
      
      res.json({ success: true, submission });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve submission' 
    });
  }
});

// Update submission status
app.patch('/api/submissions/:id', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'read', 'replied', 'archived'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid status. Must be one of: new, read, replied, archived' 
    });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const submission = await ContactSubmission.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          error: 'Submission not found' 
        });
      }

      res.json({ success: true, submission });
    } else {
      const submission = submissionsMemory.find(s => s.id === parseInt(req.params.id));
      
      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          error: 'Submission not found' 
        });
      }

      submission.status = status;
      res.json({ success: true, submission });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update submission' 
    });
  }
});

// Delete submission
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
      
      if (!submission) {
        return res.status(404).json({ 
          success: false, 
          error: 'Submission not found' 
        });
      }
      
      res.json({ success: true, message: 'Submission deleted', submission });
    } else {
      const index = submissionsMemory.findIndex(s => s.id === parseInt(req.params.id));
      
      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Submission not found' 
        });
      }
      
      const deleted = submissionsMemory.splice(index, 1);
      res.json({ success: true, message: 'Submission deleted', submission: deleted[0] });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete submission' 
    });
  }
});

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'An error occurred. Please try again later.' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🍽️  Grace Bites Server Started');
  console.log(`${'='.repeat(60)}`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nFeatures:`);
  console.log('  ✓ Express API Server');
  console.log(`  ${mongoose.connection.readyState === 1 ? '✓' : '✗'} MongoDB Database`);
  console.log(`  ${process.env.SEND_EMAIL_NOTIFICATIONS === 'true' ? '✓' : '✗'} Email Notifications`);
  console.log(`\nAPI Endpoints:`);
  console.log('  POST   /api/contact - Submit contact form');
  console.log('  GET    /api/health - Health check');
  console.log('  GET    /api/submissions - Get all submissions');
  console.log('  GET    /api/submissions/:id - Get specific submission');
  console.log('  PATCH  /api/submissions/:id - Update submission status');
  console.log('  DELETE /api/submissions/:id - Delete submission');
  console.log(`${'='.repeat(60)}\n`);
});

