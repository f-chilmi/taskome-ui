import { API } from "@/lib/contants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import HabitView from "./view";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // const habitRes = await fetch(API + "/habits?pageNumber=1&pageSize=10000", {
  //   cache: "no-store",
  //   next: { tags: ["habits"] },
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + token,
  //   },
  // });
  // const habit = await habitRes.json();

  async function getHabits(date: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;

    if (!token) throw new Error("Unauthorized");
    const res = await fetch(
      API + `/habits?pageNumber=1&pageSize=10000&date=${date}`,
      {
        cache: "no-store",
        next: { tags: ["habits"] },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Get log failed");
    }
    revalidateTag("habits");
    return await res.json();
  }

  async function updateLog(payload: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    const res = await fetch(API + "/habit-log/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: payload,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Update log failed");
    }
    revalidateTag("habits");
    await res.json();
  }

  async function createHabit(payload: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    const res = await fetch(API + "/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: payload,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Create habit failed");
    }
    revalidateTag("habits");
    await res.json();
  }

  async function deleteHabit(id: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    const res = await fetch(API + "/habits/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Delete habit failed");
    }
    revalidateTag("habits");
    await res.json();
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <HabitView
        getHabits={getHabits}
        updateLog={updateLog}
        createHabit={createHabit}
        deleteHabit={deleteHabit}
      />
    </div>
  );
}
