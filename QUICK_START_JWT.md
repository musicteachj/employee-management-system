# Quick Start Guide - JWT Authentication

## 🚀 Get Started in 5 Minutes

### Step 1: Install Server Dependencies

```bash
cd server
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
# Copy the example env file
cp env.example .env

# Edit .env and update JWT_SECRET_KEY (for production, generate with: openssl rand -hex 32)
```

### Step 3: Start the Server

```bash
# From the server directory
uvicorn app.main:app --reload
```

Server running at: `http://localhost:8000`

### Step 4: Start the Client

```bash
# In a new terminal
cd client
npm install
npm run dev
```

Client running at: `http://localhost:5173`

### Step 5: First Login

1. Open `http://localhost:5173` in your browser
2. You'll be redirected to the login page
3. Click "Register here" to create your first account
4. Fill in:
   - **Full Name:** Your name
   - **Email:** your-email@company.com
   - **Password:** At least 8 characters with uppercase, lowercase, and a number
5. Click "Register" - you'll be automatically logged in!

## ✅ What Changed?

### Server

- ✅ All API endpoints now require JWT authentication
- ✅ New endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/refresh`
- ✅ User collection in MongoDB
- ✅ Password hashing with bcrypt
- ✅ JWT token generation and validation

### Client

- ✅ Login and Register pages
- ✅ Route guards (redirects to login if not authenticated)
- ✅ Auto JWT injection in all API requests
- ✅ User info display in header
- ✅ Logout button
- ✅ Session persistence (survives page refresh)

## 🔒 Security Features

- **Password Hashing:** Passwords encrypted with bcrypt
- **JWT Tokens:** Secure, stateless authentication
- **Token Expiration:** Tokens expire after 1 hour
- **Auto Logout:** Automatic logout on token expiration
- **Protected Routes:** Both server and client-side protection

## 📚 Full Documentation

See [JWT_AUTHENTICATION.md](./JWT_AUTHENTICATION.md) for complete documentation including:

- API endpoint details
- Testing instructions
- AWS deployment guide
- Troubleshooting
- Security best practices

## 🎯 Ready for AWS?

Yes! This JWT implementation is **production-ready** and works excellently with AWS:

### Recommended AWS Architecture

```
Users → CloudFront (CDN)
      → S3 (Vue Frontend)
      → ALB (Load Balancer)
      → ECS Fargate (FastAPI Backend)
      → DocumentDB/MongoDB Atlas (Database)
      → Secrets Manager (JWT Secret)
```

### Before Deploying:

1. **Generate a secure JWT secret:**

   ```bash
   openssl rand -hex 32
   ```

2. **Store it in AWS Secrets Manager:**

   ```bash
   aws secretsmanager create-secret --name jwt-secret-key --secret-string "your-generated-key"
   ```

3. **Update CORS for your production domain**

4. **Enable HTTPS only** (use AWS Certificate Manager)

See the full deployment guide in [JWT_AUTHENTICATION.md](./JWT_AUTHENTICATION.md).

## 🐛 Quick Troubleshooting

**Problem:** Can't login  
**Solution:** Check MongoDB is running and server logs

**Problem:** "Session expired" immediately  
**Solution:** Don't change JWT_SECRET_KEY - it invalidates existing tokens

**Problem:** 401 errors on API requests  
**Solution:** Try logging out and back in

## 🎉 You're All Set!

Your Employee Management System now has enterprise-grade JWT authentication and is ready for AWS deployment!
