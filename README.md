# Launchpad-UT

A modern UNIQs launchpad platform for Ultra Times, built with React, TypeScript, and NestJS.

## Project Overview

Launchpad-UT is a full-stack application that allows users to browse, view, and mint UNIQs from various collections. The project consists of:

- **Frontend**: React application with TypeScript, Tailwind CSS, and Vite
- **Backend**: NestJS API with TypeORM and SQLite

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- [mkcert](https://github.com/FiloSottile/mkcert) (for HTTPS setup)

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd launchpad-ut
```

### Install dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Running the Application

### Development Mode

#### Backend

```bash
cd backend
npm run dev
```

The backend API will be available at http://localhost:3000.

#### Frontend

```bash
cd frontend
npm run dev
```

The frontend application will be available at http://localhost:5173/launchpad-ut/.

### Production Build

#### Backend

```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## HTTPS Setup for Local Development

To test the Ultra wallet integration locally, you need to set up HTTPS for your development environment:

### 1. Install mkcert

#### macOS (using Homebrew)

```bash
brew install mkcert
mkcert -install
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
sudo apt install mkcert
mkcert -install

# Fedora
sudo dnf install nss-tools
sudo dnf install mkcert
mkcert -install
```

#### Windows (using Chocolatey)

```bash
choco install mkcert
mkcert -install
```

### 2. Generate certificates for the project

```bash
cd frontend
npm run cert
```

This will create a `.cert` directory with the necessary certificate files.

### 3. Restart the development server

```bash
npm run dev
```

The application will now be available via HTTPS at https://localhost:5173/launchpad-ut/.

## Ultra Wallet Integration

The Ultra wallet integration requires HTTPS to work properly in development mode. After setting up HTTPS as described above, you can test the wallet connection functionality.

### Testing Ultra Wallet

1. Make sure you have the [Ultra wallet extension](https://chromewebstore.google.com/detail/ultra-wallet) installed in your browser
2. Access the application via HTTPS: https://localhost:5173/launchpad-ut/
3. Click the "Connect Ultra Wallet" button in the header
4. Follow the wallet prompts to connect

## Environment Configuration

### Frontend Environment Variables

The frontend uses different environment files for development and production:

- `.env` - Development environment
- `.env.production` - Production environment

Key variables:

- `VITE_APP_PATHNAME` - Base path for the application
- `VITE_APP_API_URL` - URL for the backend API
- `VITE_APP_ASSETS_URL` - URL for static assets

### Backend Environment Variables

The backend uses environment variables for configuration:

- `PORT` - Port number (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Project Structure

```
launchpad-ut/
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── config/         # Application configuration
│   │   ├── modules/        # Feature modules
│   │   ├── database/       # Database configuration
│   │   └── main.ts         # Application entry point
│   └── package.json
│
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── views/          # Page components
│   │   └── main.tsx        # Application entry point
│   └── package.json
│
└── README.md
```

## Deployment

### Backend Deployment (Vercel)

The backend is configured for deployment on Vercel using the `vercel.json` configuration file.

### Frontend Deployment (Vercel)

The frontend is configured for deployment on Vercel using the `vercel.json` configuration file.

## Troubleshooting

### HTTPS Certificate Issues

If you encounter certificate issues:

1. Make sure mkcert is properly installed
2. Run `mkcert -install` again to ensure the local CA is trusted
3. Regenerate certificates with `npm run cert` in the frontend directory
4. Clear browser cache and restart the browser

### Ultra Wallet Connection Issues

If you have issues connecting to the Ultra wallet:

1. Ensure you're using HTTPS in development
2. Check that the Ultra wallet extension is installed and up to date
3. Make sure you're not in incognito/private browsing mode
4. Try restarting your browser

## Contributing

Please follow the existing code style and structure when contributing to the project.

## License

This project is under copyright by Ultra Times.