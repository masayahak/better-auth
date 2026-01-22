"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "server/user"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, ShieldCheck } from "lucide-react"

const formSchema = z.object({
  email: z.email({ message: "無効なメール形式です" }),
  password: z.string().min(6).max(50),
})


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loadingType, setLoadingType] = useState<'idle' | 'normal' | 'dummy' | 'dummyAdmin'>('idle');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingType('normal');
    const { success, message } = await signIn(values.email, values.password);
    if (success) {
      toast.success(message as string)
      router.push("/");

    } else {
      toast.error(message as string)
    }
    setLoadingType('idle');
  }

  async function onDummyUserLogin() {
    setLoadingType('dummy');
    const { success, message } = await signIn("test@test.com", "password123");
    if (success) {
      toast.success(message as string)
      router.push("/");

    } else {
      toast.error(message as string)
    }
    setLoadingType('idle');
  }

  async function onDummyAdminLogin() {
    setLoadingType('dummyAdmin');
    const { success, message } = await signIn("admin@test.com", "adminpassword123");
    if (success) {
      toast.success(message as string)
      router.push("/");

    } else {
      toast.error(message as string)
    }
    setLoadingType('idle');
  }

  const isAnyLoading = loadingType !== 'idle';

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Better Auth デモ ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
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
                <Field>
                  <Button type="submit" disabled={isAnyLoading}>
                    {loadingType === 'normal' ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : ("ログイン")}
                  </Button>
                  <FieldDescription className="text-center">
                    初めてのご利用ですか？ <a href="/signup">アカウント作成</a>
                  </FieldDescription>
                  <Button
                    className="mt-1"
                    type="button"
                    variant="outline"
                    onClick={onDummyAdminLogin}
                    disabled={isAnyLoading}
                  >
                    {loadingType === 'dummyAdmin' ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 size-4" />
                        ダミー（管理者）ユーザーでログイン
                      </>
                    )}
                  </Button>
                  <Button
                    className="mt-6"
                    type="button"
                    variant="outline"
                    onClick={onDummyUserLogin}
                    disabled={isAnyLoading}
                  >
                    {loadingType === 'dummy' ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 size-4" />
                        ダミー（一般）ユーザーでログイン
                      </>
                    )}
                  </Button>
                </Field>
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
          <span className="bg-black text-white px-2 py-0.5 rounded font-bold">
            Next.js
          </span>
          <span className="text-gray-800">&</span>
          {/* Tailwind CSS のブランドカラー (シアン) */}
          <span className="bg-cyan-500 text-white px-2 py-0.5 rounded font-bold">
            Tailwind CSS
          </span>
        </div>
      </footer>
    </div>
  )
}
