# Environment Variables Setup Guide

This guide will help you configure the environment variables for the MERN E-Commerce application.

## 📋 Prerequisites

Before setting up the environment variables, make sure you have:
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- PayPal Developer account (for payment processing)

## 🔧 Server Configuration

### 1. Copy the example file
```bash
cd server
cp .env.example .env
```

### 2. Configure each variable

#### Database Configuration
- **MONGO_URI**: Your MongoDB connection string
  - **Local MongoDB**: `mongodb://localhost:27017/mern-ecommerce`
  - **MongoDB Atlas**: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
  - Get MongoDB Atlas: https://www.mongodb.com/cloud/atlas

#### JWT Configuration
- **JWT_SECRET**: A strong, random secret key for JWT token generation
  - Generate a secure key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

#### Cloudinary Configuration
Get your credentials from: https://cloudinary.com/console
- **CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name
- **CLOUDINARY_API_KEY**: Your Cloudinary API key
- **CLOUDINARY_API_SECRET**: Your Cloudinary API secret

#### PayPal Configuration
Get your credentials from: https://developer.paypal.com/
- **PAYPAL_MODE**: `sandbox` for testing, `live` for production
- **PAYPAL_CLIENT_ID**: Your PayPal client ID
- **PAYPAL_CLIENT_SECRET**: Your PayPal client secret

For testing, use PayPal Sandbox:
1. Go to https://developer.paypal.com/
2. Create a sandbox account
3. Get your sandbox credentials from the dashboard

## 💻 Client Configuration

### 1. Copy the example file
```bash
cd client
cp .env.example .env
```

### 2. Configure the API URL
- **VITE_API_URL**: Your backend API URL
  - **Development**: `http://localhost:5000`
  - **Production**: Your deployed backend URL

## 🚀 Running the Application

### Start the Server
```bash
cd server
npm install
npm run dev
```

### Start the Client
```bash
cd client
npm install
npm run dev
```

## ⚠️ Important Notes

1. **Never commit `.env` files** to version control
   - The `.gitignore` file should already exclude `.env` files
   - Only commit `.env.example` files

2. **Keep your secrets secure**
   - Never share your JWT_SECRET, API keys, or credentials
   - Use different secrets for development and production

3. **Update production values**
   - Change `PAYPAL_MODE` to `live` in production
   - Use strong, unique JWT_SECRET in production
   - Update `CLIENT_URL` to your production frontend URL

## 🔍 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local)
- Check your connection string format
- Verify network access in MongoDB Atlas

### Cloudinary Upload Issues
- Verify your credentials are correct
- Check your Cloudinary account is active
- Ensure you have upload permissions

### PayPal Payment Issues
- Verify you're using sandbox mode for testing
- Check your PayPal credentials
- Ensure your PayPal account is verified

## 📝 Example .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mern-ecommerce

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=60m

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# CORS
CLIENT_URL=http://localhost:5173
```

## 📞 Need Help?

If you encounter any issues:
1. Check that all required variables are set
2. Verify your credentials are correct
3. Ensure services (MongoDB, Cloudinary, PayPal) are accessible
4. Check the server logs for specific error messages
