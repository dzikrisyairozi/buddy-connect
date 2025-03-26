# Buddy Connect Backend

Backend API server for the Buddy Connect application using Firebase.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Firebase Admin SDK
- Firestore for database
- Firebase Authentication
- Middleware for security and error handling

## Directory Structure

```
buddy-connect/backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── core/         # Core application setup
│   ├── entities/     # TypeScript interfaces
│   ├── middlewares/  # Custom middleware
│   ├── repository/   # Data access layer
│   ├── routes/       # API routes
│   └── server.ts     # Server entry point
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Firebase Project with Firestore database

### Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Set up Firestore database
3. Generate a new private key from Project Settings > Service Accounts
4. Save the private key JSON file (do not commit to version control)
5. Use the values from this JSON file to populate your `.env` file

### Installation

1. Clone the repository
2. Navigate to the backend directory: `cd buddy-connect/backend`
3. Install dependencies: `npm install`
4. Create a `.env` file based on the provided example and add your Firebase credentials
5. Run the development server: `npm run dev`

### Available Scripts

- `npm run dev`: Starts the development server with hot-reload
- `npm run build`: Builds the application for production
- `npm start`: Runs the built application in production mode

## API Endpoints

### User Endpoints

- `GET /api/users/me`: Get current user data
- `GET /api/users/:id`: Get user data by ID
- `PUT /api/users/me`: Update current user data
- `PUT /api/users/:id`: Update user data by ID

### Health Check

- `GET /health`: Check API status

## Authentication

This API uses Firebase Authentication. To access protected endpoints:

1. Authenticate with Firebase Authentication on the client side
2. Get the ID token from the authenticated user
3. Include the token in the Authorization header: `Authorization: Bearer YOUR_TOKEN`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

ISC
