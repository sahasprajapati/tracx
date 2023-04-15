import { config } from 'dotenv';
config();
export const appConfig = {
  app: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },
};
