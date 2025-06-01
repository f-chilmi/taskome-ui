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

    return await res.json();
  }

  async function getEvents(date: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;

    if (!token) throw new Error("Unauthorized");
    const res = await fetch(
      API + `/events?pageNumber=1&pageSize=10000&date=${date}`,
      {
        cache: "no-store",
        next: { tags: ["events"] },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Get events failed");
    }

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

  async function createEvent(payload: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    const res = await fetch(API + "/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: payload,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Create event failed");
    }
    revalidateTag("events");
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

  const date = new Date().toISOString();
  const [habits, events] = await Promise.all([
    getHabits(date),
    getEvents(date),
  ]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <HabitView
        initialData={{ habits: habits.data, events: events.data }}
        createEvent={createEvent}
        getHabits={getHabits}
        getEvents={getEvents}
        updateLog={updateLog}
        createHabit={createHabit}
        deleteHabit={deleteHabit}
      />
    </div>
  );
}
