# JWT Authentication Implementation

This document describes the JWT authentication system implemented for the Employee Management System.

## Overview

The application now uses **JWT (JSON Web Tokens)** for authentication. All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header.

## Features

✅ **Secure Authentication** - Password hashing with bcrypt  
✅ **JWT Tokens** - Industry-standard token-based authentication  
✅ **Token Refresh** - Refresh tokens without re-logging in  
✅ **Protected Routes** - Both server and client-side route protection  
✅ **Auto Token Injection** - JWT automatically added to all API requests  
✅ **Session Persistence** - Authentication state persists across page refreshes  
✅ **Automatic Logout** - On token expiration (401 responses)

---

## Setup Instructions

### 1. Server Setup

#### Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

New dependencies added:

- `python-jose[cryptography]` - JWT encoding/decoding
- `passlib[bcrypt]` - Password hashing

#### Configure Environment

Update your `.env` file:

```bash
# JWT Settings
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

⚠️ **IMPORTANT**: Generate a secure secret key for production:

```bash
openssl rand -hex 32
```

#### Start the Server

```bash
uvicorn app.main:app --reload
```

The server will be available at `http://localhost:8000`

---

### 2. Client Setup

#### Install Dependencies (already included)

The client uses existing dependencies:

- `zod` - Schema validation
- `vee-validate` - Form validation
- `pinia` - State management

#### Start the Client

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:5173`

---

## API Endpoints

### Authentication Endpoints (No Auth Required)

#### POST `/api/auth/register`

Register a new user

**Request:**

```json
{
  "email": "user@company.com",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "is_admin": false
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@company.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST `/api/auth/login`

Login with credentials

**Request:**

```json
{
  "email": "user@company.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### GET `/api/auth/me`

Get current user info (Requires Authentication)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@company.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST `/api/auth/refresh`

Refresh access token (Requires Authentication)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### Protected Endpoints (Requires Authentication)

All employee management endpoints now require authentication:

- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/{id}` - Get employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `POST /api/employees/search` - Search employees
- `GET /api/managers` - Get managers
- And all other existing endpoints...

**Headers Required:**

```
Authorization: Bearer <your-jwt-token>
```

---

## Client Usage

### 1. Authentication Flow

#### First Time User

1. Navigate to `http://localhost:5173`
2. You'll be redirected to `/login`
3. Click "Register here" to create an account
4. Fill in your details (password must be 8+ chars with uppercase, lowercase, and number)
5. After successful registration, you'll be automatically logged in

#### Returning User

1. Navigate to `http://localhost:5173`
2. You'll be redirected to `/login` if not authenticated
3. Enter your email and password
4. Click "Login"
5. You'll be redirected to the home page

### 2. Using the Application

Once logged in:

- Your name appears in the top-right corner
- Click the logout icon (🚪) to logout
- All API requests automatically include your JWT token
- Navigation is protected - unauthenticated users can't access employee pages

### 3. Session Persistence

Your authentication state is saved in browser localStorage:

- Refresh the page - you stay logged in
- Close and reopen browser - you stay logged in
- Token expires after 1 hour - you'll be automatically logged out

---

## Technical Architecture

### Server Side

#### Authentication Flow

```
User → POST /api/auth/login
     → Validate credentials
     → Generate JWT token
     → Return token to client
```

#### Protected Route Flow

```
Client Request → Include Authorization header
              → FastAPI dependency validates token
              → Extract user from token
              → Grant or deny access
```

#### Key Files

- `server/app/models/user.py` - User models
- `server/app/routes/auth.py` - Authentication routes
- `server/app/services/auth_service.py` - User management logic
- `server/app/utils/security.py` - Password hashing, JWT creation/validation
- `server/app/utils/dependencies.py` - Auth dependencies for protecting routes
- `server/app/config.py` - JWT configuration

### Client Side

#### Authentication Flow

```
User → Login Form → Submit credentials
    → Auth Store → API call
    → Receive token → Store in localStorage
    → Update auth state → Fetch user info
    → Redirect to home
```

#### Protected Route Flow

```
Navigation → Router Guard
          → Check isAuthenticated
          → Allow or redirect to /login
```

#### Key Files

- `client/src/stores/auth.ts` - Pinia auth store
- `client/src/views/Login.vue` - Login page
- `client/src/views/Register.vue` - Registration page
- `client/src/schemas/auth.ts` - Form validation schemas
- `client/src/router/index.ts` - Route guards
- `client/src/types/index.ts` - Auth type definitions

---

## Security Best Practices

### For Development

✅ Current implementation includes:

- Password hashing with bcrypt
- JWT token expiration (1 hour)
- Protected routes on both client and server
- Automatic logout on token expiration
- Environment variable configuration

### For Production

⚠️ **Before deploying to AWS, ensure:**

1. **Secure JWT Secret**

   ```bash
   # Generate a strong secret key
   openssl rand -hex 32

   # Store in AWS Secrets Manager
   aws secretsmanager create-secret --name jwt-secret-key --secret-string "your-key"
   ```

2. **HTTPS Only**

   - Use AWS Certificate Manager
   - Configure ALB/CloudFront for HTTPS
   - Set secure cookie flags

3. **Environment Variables**

   ```bash
   # Use AWS Systems Manager Parameter Store or Secrets Manager
   JWT_SECRET_KEY=<from-secrets-manager>
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```

4. **CORS Configuration**

   ```python
   # Update server/app/config.py
   cors_origins: List[str] = ["https://your-production-domain.com"]
   ```

5. **Token Security**

   - Consider shorter expiration times for production
   - Implement refresh token rotation
   - Add token blacklisting for logout

6. **Rate Limiting**
   - Add rate limiting to authentication endpoints
   - Prevent brute force attacks

---

## Testing

### Manual Testing

#### 1. Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "password": "TestPass123",
    "full_name": "Test User"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "password": "TestPass123"
  }'
```

Save the `access_token` from the response.

#### 3. Access Protected Endpoint

```bash
curl http://localhost:8000/api/employees \
  -H "Authorization: Bearer <your-access-token>"
```

#### 4. Test Without Token (Should Fail)

```bash
curl http://localhost:8000/api/employees
# Returns 401 Unauthorized
```

---

## Troubleshooting

### Issue: "Session expired" message appears immediately

**Solution:** Check if your JWT_SECRET_KEY is consistent and hasn't changed. Changing the secret invalidates all existing tokens.

### Issue: "401 Unauthorized" on all requests

**Solution:**

1. Check if you're logged in (look for user name in top-right)
2. Try logging out and back in
3. Check browser localStorage for `auth_token`
4. Verify server is running

### Issue: Can't register/login

**Solution:**

1. Check server logs for errors
2. Verify MongoDB is running
3. Check network tab in browser DevTools
4. Ensure password meets requirements (8+ chars, uppercase, lowercase, number)

### Issue: Token expires too quickly

**Solution:** Update `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`:

```bash
ACCESS_TOKEN_EXPIRE_MINUTES=120  # 2 hours
```

---

## AWS Deployment Recommendations

### Option 1: Self-Managed JWT (Current Implementation)

**Architecture:**

```
CloudFront → S3 (Vue App)
           ↓
ALB → ECS Fargate (FastAPI)
    → DocumentDB/MongoDB Atlas
```

**Pros:**

- Full control over authentication
- No vendor lock-in
- Simple to understand

**Best for:** Small to medium applications

### Option 2: AWS Cognito Integration

**Architecture:**

```
CloudFront → S3 (Vue App)
           ↓
Cognito User Pool → ALB → ECS Fargate (FastAPI)
                         → DocumentDB/MongoDB Atlas
```

**Pros:**

- Managed authentication service
- Built-in MFA, password policies
- Social login support
- Automatic scaling

**Best for:** Enterprise applications

---

## Next Steps

### Recommended Enhancements

1. **Email Verification** - Verify email addresses on registration
2. **Password Reset** - Allow users to reset forgotten passwords
3. **MFA (Multi-Factor Authentication)** - Add 2FA for enhanced security
4. **Role-Based Access Control (RBAC)** - Implement fine-grained permissions
5. **Admin Dashboard** - Create admin interface for user management
6. **OAuth Integration** - Add Google/Microsoft login
7. **Audit Logging** - Log authentication events

### Migration to AWS Cognito

If you decide to use AWS Cognito later, the client-side code requires minimal changes:

- Replace login/register API calls with Cognito SDK
- Server validates Cognito JWT instead of self-issued JWT
- Keep route guards and token storage logic

---

## Support

For issues or questions:

1. Check this documentation
2. Review server logs: `tail -f server.log`
3. Check browser console for client-side errors
4. Review API documentation: `http://localhost:8000/docs`

---

## License

This authentication implementation is part of the Employee Management System.
