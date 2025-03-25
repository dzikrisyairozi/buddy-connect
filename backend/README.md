# Buddy Connect Backend

Backend API server for the Buddy Connect application.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Authentication with JWT
- Middleware for security and error handling

## Directory Structure

```
buddy-connect/backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middlewares/  # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   ├── app.ts        # Express app
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
- MongoDB

### Installation

1. Clone the repository
2. Navigate to the backend directory: `cd buddy-connect/backend`
3. Install dependencies: `npm install`
4. Create a `.env` file based on the provided example
5. Run the development server: `npm run dev`

### Available Scripts

- `npm run dev`: Starts the development server with hot-reload
- `npm run build`: Builds the application for production
- `npm start`: Runs the built application in production mode

## API Endpoints

### Health Check
- `GET /api/health`: Check API status

More endpoints will be documented as they are implemented.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

ISC 