const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sendEmail = require('./sendEmail'); // Import the email sending module
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Specify the port here

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

const otpStore = {}; // Initialize the OTP storage

app.get('/get', (req, res) => {
  res.send('Hello World');
});


app.post('/sendEmailOTP', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    
    try {
      otpStore[email] = otp; 
      
      // Send OTP via email
      await sendEmail({
        email: email,
        subject: 'Your OTP Code',
        message: `Your OTP is: ${otp}`
      });
      
      res.status(200).send({ success: true, message: 'OTP sent successfully!' });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Failed to send OTP' });
    }
});
  
app.post('/verifyEmailOTP', (req, res) => {
    const { email, otp } = req.body;
  
    // Check if the OTP is correct
    if (otpStore[email] && otpStore[email] == otp) {
      // If correct, you can proceed (e.g., authenticate user, etc.)
      res.status(200).send({ success: true, message: 'OTP verified!' });
    } else {
      res.status(400).send({ success: false, message: 'Invalid OTP' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
