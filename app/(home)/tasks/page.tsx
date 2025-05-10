import { TaskDataTable } from "@/components/task-data-table";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function Page() {
  const projectsRes = await fetch(
    "http://localhost:8080/api/v1/projects?pageNumber=1&pageSize=10000"
  );
  const projectData = await projectsRes.json();

  const userRes = await fetch(
    "http://localhost:8080/api/v1/users?pageNumber=1&pageSize=10000"
  );
  const userData = await userRes.json();

  const res = await fetch(
    "http://localhost:8080/api/v1/tasks?pageNumber=1&pageSize=10000",
    { next: { tags: ["tasks"] } }
  );
  const data = await res.json();

  async function create(formData: FormData) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const projectId = formData.get("projectId") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const dueDate = formData.get("dueDate") as string;

    const payload: Record<string, string> = {
      title,
    };

    if (description) payload.description = description;
    if (status) payload.status = status;
    if (priority) payload.priority = priority;
    if (projectId) payload.projectId = projectId;
    if (assignedTo) payload.assignedTo = assignedTo;
    if (dueDate) payload.dueDate = dueDate;

    const res = await fetch("http://localhost:8080/api/v1/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Update project failed");
    }
    const data = await res.json();
    revalidateTag("tasks");
    return data;
  }
  async function update(formData: FormData) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const projectId = formData.get("projectId") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const dueDate = formData.get("dueDate") as string;

    const payload: Record<string, string> = {
      title,
    };

    if (description) payload.description = description;
    if (status) payload.status = status;
    if (priority) payload.priority = priority;
    if (projectId) payload.projectId = projectId;
    if (assignedTo) payload.assignedTo = assignedTo;
    if (dueDate) payload.dueDate = format(dueDate, "yyyy-MM-dd");

    const res = await fetch("http://localhost:8080/api/v1/tasks/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Update task failed");
    }
    const data = await res.json();
    revalidateTag("tasks");
    return data;
  }

  async function deleteTask(id: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch("http://localhost:8080/api/v1/tasks/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Delete task failed");
    }
    await res.json();
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <TaskDataTable
        data={data.data}
        projectData={projectData.data}
        userData={userData.data}
        create={create}
        update={update}
        deleteTask={deleteTask}
      />
    </div>
  );
}
