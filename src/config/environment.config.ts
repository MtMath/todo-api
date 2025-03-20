import { registerAs } from "@nestjs/config";

export const environmentConfig = registerAs("environment", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || "86400", 10),
  },
}));
