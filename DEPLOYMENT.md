# Grace Bites Deployment Guide

This guide covers deploying Grace Bites to production on various platforms.

## Prerequisites

- Node.js 14+ installed locally
- Git installed
- All dependencies installed (`npm install`)
- All tests passing locally

## Local Development

### Setup
```powershell
npm install
```

### Environment Variables (.env)
```
PORT=3000
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@gracebites.com
MONGODB_URI=mongodb://localhost:27017/grace-bites
SEND_EMAIL_NOTIFICATIONS=true
```

### Run Server
```powershell
npm start        # Production mode
npm run dev      # Development with auto-reload
```

---

## Deployment Options

### Option 1: Deploy to Heroku (Recommended for Beginners)

#### Prerequisites
- Heroku account (free: https://www.heroku.com)
- Heroku CLI installed
- Git repository initialized

#### Steps

1. **Install Heroku CLI**
   ```powershell
   choco install heroku-cli
   # or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```powershell
   heroku login
   ```

3. **Create Heroku app**
   ```powershell
   cd "C:\Users\Fa\Documents\Anenenji\Programming\grace-bites"
   heroku create grace-bites-app
   ```

4. **Set environment variables**
   ```powershell
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_SERVICE=gmail
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   heroku config:set ADMIN_EMAIL=admin@gracebites.com
   heroku config:set SEND_EMAIL_NOTIFICATIONS=true
   ```

5. **Add MongoDB (MongoDB Atlas free tier)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Set Heroku config:
   ```powershell
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grace-bites
   ```

6. **Deploy**
   ```powershell
   git push heroku main
   # Or if using master branch:
   git push heroku master
   ```

7. **View logs**
   ```powershell
   heroku logs --tail
   ```

8. **Open app**
   ```powershell
   heroku open
   ```

Your app will be live at: `https://grace-bites-app.herokuapp.com`

---

### Option 2: Deploy to Vercel

#### Prerequisites
- Vercel account (free: https://vercel.com)
- Vercel CLI installed

#### Steps

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Deploy**
   ```powershell
   cd "C:\Users\Fa\Documents\Anenenji\Programming\grace-bites"
   vercel
   # Follow the prompts
   ```

3. **Set environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from .env

**Note:** Vercel is optimized for serverless, you may need to refactor Node.js code to use Vercel Functions.

---

### Option 3: Deploy to AWS (EC2)

#### Prerequisites
- AWS account
- EC2 instance running (Ubuntu 20.04 or similar)
- SSH access to instance

#### Steps

1. **SSH into your instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

2. **Install Node.js and npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone your repository**
   ```bash
   git clone https://github.com/yourusername/grace-bites.git
   cd grace-bites
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create .env file**
   ```bash
   sudo nano .env
   # Paste your environment variables
   ```

6. **Install PM2 (process manager)**
   ```bash
   sudo npm install -g pm2
   ```

7. **Start application with PM2**
   ```bash
   pm2 start server.js --name grace-bites
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx as reverse proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add configuration:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

9. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

---

### Option 4: Deploy to DigitalOcean

#### Prerequisites
- DigitalOcean account
- Droplet created (Ubuntu 20.04)

#### Steps (Similar to AWS)

1. Create Droplet with Node.js app platform
2. Connect via SSH
3. Follow AWS steps 2-9 above

---

### Option 5: Deploy to Render

1. Go to https://render.com
2. Connect GitHub account
3. Create new Web Service
4. Select your repository
5. Set Environment Variables
6. Deploy

---

## Production Checklist

- [ ] All environment variables set correctly
- [ ] MongoDB connected and working
- [ ] Email notifications configured
- [ ] HTTPS/SSL certificate installed
- [ ] Error logging setup
- [ ] Backups scheduled
- [ ] Domain name configured
- [ ] Status monitoring enabled

---

## Email Configuration

### Gmail (Recommended for testing)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `EMAIL_PASSWORD`

### Production Email Services

Instead of Gmail, use professional services:
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://www.mailgun.com
- **AWS SES**: https://aws.amazon.com/ses/

Update `services/emailService.js` to use your chosen service.

---

## Database

### Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod

# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo
```

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Create database user
5. Whitelist IP addresses
6. Get connection string
7. Set `MONGODB_URI` in .env

---

## Monitoring & Logging

### Log Files
- Heroku: `heroku logs --tail`
- AWS/DigitalOcean: Check PM2 logs: `pm2 logs`

### Error Tracking (Optional)
- Sentry: https://sentry.io
- Logrocket: https://logrocket.com
- Datadog: https://www.datadoghq.com

---

## Performance Optimization

1. Enable gzip compression
2. Add CDN for static assets
3. Cache busting for CSS/JS
4. Database indexing
5. Load balancing

---

## Security Best Practices

1. Keep dependencies updated: `npm audit fix`
2. Use HTTPS/TLS
3. Set secure environment variables
4. Validate all inputs
5. Use CORS carefully
6. Implement rate limiting
7. Regular backups

---

## Rollback Procedure

### Heroku
```powershell
heroku releases
heroku releases:rollback v<number>
```

### Git
```bash
git log
git revert <commit-hash>
git push
```

---

## Support & Troubleshooting

**Port already in use**
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

**MongoDB connection error**
- Check connection string
- Verify IP whitelist (MongoDB Atlas)
- Check credentials

**Email not sending**
- Check EMAIL_USER and EMAIL_PASSWORD
- Verify SEND_EMAIL_NOTIFICATIONS=true
- Check spam folder

---

## Questions?

For more help:
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Heroku: https://devcenter.heroku.com
- Node.js: https://nodejs.org/docs/
