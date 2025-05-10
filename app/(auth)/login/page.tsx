import { LoginForm } from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Login failed");
    }
    const data = await res.json();
    console.log(data);
    (await cookies()).set("token", data.tokens, {
      httpOnly: true,
      path: "/",
    });
    (await cookies()).set("user", JSON.stringify(data.data), {
      httpOnly: false,
    });

    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm action={login} />
      </div>
    </div>
  );
}
