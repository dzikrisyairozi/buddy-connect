// Application configuration
interface Config {
  port: number;
  nodeEnv: string;
  mongoURI: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  apiVersion: string;
  apiPrefix: string;
}

const config: Config = {
  // Server configs
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database configs
  mongoURI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/buddy-connect",

  // JWT configs (for future use)
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  // API configs
  apiVersion: "v1",
  apiPrefix: "/api",
};

export default config;
