"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });
    return {
      success: true,
      message: "ログインに成功しました",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return {
      success: false,
      message: message,
    };
  }
};

export const signUp = async (email: string, name: string, password: string) => {
  try {
    // Better Authの仕様上、roleはuserしか設定できない
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });
    if (!res?.user) {
      throw new Error("ユーザー作成に失敗しました");
    }
    return { success: true, message: "登録が完了しました" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    // エラーハンドリング
    console.error(message);
    return {
      success: false,
      message: message,
    };
  }
};
