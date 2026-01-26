# Grace Bites - Food Website with Backend

A beautiful, responsive food website built with HTML, CSS, JavaScript, and Express.js backend for form submissions.

## Features

- **Responsive Design** — Mobile-friendly layout that works on all devices
- **3 Pages** — Home, Gallery, and Contact Us
- **Image Lightbox** — Click images to view in full-screen gallery with navigation
- **Form Validation** — Client and server-side validation for contact form
- **Backend API** — Express.js server to handle form submissions
- **Email Notifications** — Automated emails to admin and user confirmation emails
- **MongoDB Database** — Persistent storage for all form submissions with fallback to memory
- **Real Food Images** — High-quality images from Unsplash
- **Smooth Animations** — Modern animations and transitions
- **Professional Design** — Warm color scheme perfect for food business
- **Production Ready** — Includes deployment guides for Heroku, AWS, DigitalOcean, Vercel

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- MongoDB (local or cloud) - [Download](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- (Optional) Gmail account for email notifications

### Steps

1. **Navigate to project folder:**
   ```powershell
   cd "C:\Users\Fa\Documents\Anenenji\Programming\grace-bites"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the server:**
   ```powershell
   npm start
   ```
   The server will run on `http://localhost:3000`

4. **Open in browser:**
   - Open your browser and go to `http://localhost:3000`
   - You should see the Grace Bites home page

### Development Mode (with auto-reload)
```powershell
npm run dev
```
This requires nodemon to be installed (`npm install --save-dev nodemon`)

## API Endpoints

### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Your message here..."
}

Response:
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully...",
  "submissionId": "507f1f77bcf86cd799439011"
}
```

### Check Server Health
```
GET /api/health

Response:
{
  "status": "Server is running",
  "timestamp": "2025-12-10T10:00:00.000Z",
  "mongodb": "Connected",
  "emailNotifications": "Enabled"
}
```

### Get All Submissions
```
GET /api/submissions

Response:
{
  "success": true,
  "count": 5,
  "source": "MongoDB",
  "submissions": [...]
}
```

### Get Specific Submission
```
GET /api/submissions/:id
```

### Update Submission Status
```
PATCH /api/submissions/:id
Content-Type: application/json

{
  "status": "read"  // or "replied", "archived"
}
```

### Delete Submission
```
DELETE /api/submissions/:id
```

## File Structure

```
grace-bites/
├── index.html          # Home page
├── gallery.html        # Gallery page
├── contact.html        # Contact page
├── styles.css          # Stylesheet
├── script.js           # Frontend JavaScript
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env                # Environment variables
└── README.md           # This file
```

## Customization

### Change Location
Edit the location in `contact.html`:
```html
<p>Chileka Chatha</p>
```

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary-color: #d35400;
  --secondary-color: #1a1a1a;
  --accent-color: #f39c12;
  /* ... more variables */
}
```

### Configure Email Notifications

**Gmail Setup:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Update `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ADMIN_EMAIL=admin@gracebites.com
   SEND_EMAIL_NOTIFICATIONS=true
   ```

**Other Email Services:**
- Update `services/emailService.js` to use SendGrid, Mailgun, or AWS SES
- Services like these are more reliable for production

### Configure MongoDB

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/grace-bites
```

**MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grace-bites
   ```

## Features in Detail

### Home Page
- Hero section with call-to-action
- Featured food items (3 picture boxes)
- Responsive grid layout

### Gallery Page
- 9 food items in responsive grid
- Click any image to open fullscreen lightbox
- Keyboard navigation (arrow keys)
- Smooth animations on scroll

### Contact Page
- Contact form with validation
- Business information (location, phone, email, hours)
- Real-time form feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

- Images are optimized and loaded from CDN
- CSS and JS are minified in production
- Responsive images scale based on screen size

## Next Steps

1. Replace placeholder contact info with real details
2. Add email sending (using Nodemailer or SendGrid)
3. Add database storage for submissions (MongoDB, PostgreSQL)
4. Deploy to cloud (Heroku, Vercel, AWS, etc.)
5. Add SSL certificate for HTTPS

## Deployment

To deploy to production (Heroku, AWS, DigitalOcean, Vercel, etc.):

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide with step-by-step instructions for each platform.**

Quick Heroku Deploy:
```powershell
heroku create grace-bites-app
heroku config:set MONGODB_URI=your-mongodb-connection-string
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
git push heroku main
heroku open
```

Your app will be live at `https://grace-bites-app.herokuapp.com`

## Next Steps

1. Configure email service (Gmail or SendGrid)
2. Set up MongoDB (local or Atlas cloud)
3. Test form submission locally
4. Deploy to production using [DEPLOYMENT.md](./DEPLOYMENT.md)
5. Set up SSL/HTTPS certificate
6. Configure custom domain name
7. Set up monitoring and backups

## License

MIT

## Support

For questions or issues, please contact: hello@gracebites.com

---

**Happy Coding! 🍽️**
