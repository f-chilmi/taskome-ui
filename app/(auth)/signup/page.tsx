import { SignupForm } from "@/components/signup-form";
import { API } from "@/lib/contants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  async function signup(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Register failed");
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
        <SignupForm action={signup} />
      </div>
    </div>
  );
}
