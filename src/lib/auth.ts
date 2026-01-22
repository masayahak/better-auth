import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  session: {
    // セッションの有効期限 (例: 10分)
    expiresIn: 60 * 10,

    // セッションを更新する頻度 (例: １分)
    // この期間が経過した後にアクセスすると、有効期限が `expiresIn` 分だけ再延長される
    updateAge: 60,
  },
  plugins: [
    admin(),
    nextCookies(), // 常に配列の最後に配置
  ],
});
