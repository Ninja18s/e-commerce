import * as dotenv from "dotenv";
import { ENV } from "@constants/environment";

dotenv.config();

interface AppConfig {
  port: number;
  mongoDbUrl: string;
  secretKey: string;
}

const env = process.env.NODE_ENV || ENV.DEV;

const defaultConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongoDbUrl: process.env.MONGO_URI || '',
  secretKey: "T$F^%TYsHG#@HF",
};

const devConfig = {
  mongoDbUrl: "mongodb://localhost:27017/",
  secretKey: "T$F^%TYsHG#@HF",
};

const prodConfig = {
  mongoDbUrl: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
};

const config: AppConfig = {
  ...(env === ENV.DEV ? devConfig : {}),
  ...(env === ENV.PROD ? prodConfig : {}),
  ...defaultConfig,
};

export default config;

