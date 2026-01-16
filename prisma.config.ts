import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Ajustá este path si tu schema NO está en prisma/schema.prisma
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
