"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { signUp } from "server/user";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.email({ message: "無効なメール形式です" }),
  userName: z.string().min(6, { message: "ユーザー名は6文字以上必要です" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上必要です" })
    .max(50, { message: "パスワードは50文字以内にしてください" }),
  isAdmin: z.boolean(),
});

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      isAdmin: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const role = values.isAdmin ? "admin" : "user";
    const { success, message } = await signUp(values.email, values.userName, values.password, role);
    if (success) {
      toast.success(message as string);
      router.push("/");
    } else {
      toast.error(message as string);
    }
    setIsLoading(false);
  }

  function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // フォーム送信を防ぐ
    e.stopPropagation(); // 親要素へのイベント伝播を防ぐ
    router.push("/login");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">アカウントの作成</CardTitle>
          <CardDescription>利用者情報を登録してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ユーザー名</FormLabel>
                      <FormControl>
                        <Input placeholder="○山 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input placeholder="test@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード</FormLabel>
                      <FormControl>
                        <Input placeholder="********" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>管理者として登録</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          デモ用：チェックすると admin ロールが付与されます。
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 mt-6">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : "登録"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
                    <ArrowLeft className="mr-2 size-4" />
                    ログイン画面に戻る
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <footer className="mt-8 mb-4 text-xs text-center text-muted-foreground">
        <div className="mb-2">
          <span>Developed by </span>
          <a
            href="https://hakamata-soft.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 hover:underline"
          >
            HakamataSoft
          </a>
        </div>

        <div className="flex text-xs items-center justify-center gap-2">
          <span className="text-muted-foreground">Powered by</span>
          {/* Next.js のブランドカラー (黒/白) */}
          <span className="bg-black text-white px-2 py-0.5 rounded font-bold">Next.js</span>
          <span className="text-gray-800">&</span>
          {/* Tailwind CSS のブランドカラー (シアン) */}
          <span className="bg-cyan-500 text-white px-2 py-0.5 rounded font-bold">Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
