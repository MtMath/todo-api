import { registerAs } from "@nestjs/config";

export const environmentConfig = registerAs("environment", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
}));
