import { ProjectDataTable } from "@/components/project-data-table";
import { cookies } from "next/headers";

export default async function Page() {
  const res = await fetch(
    "http://localhost:8080/api/v1/projects?pageNumber=1&pageSize=10000"
  );
  const data = await res.json();

  async function getDetail(id: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch("http://localhost:8080/api/v1/projects/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Get project failed");
    }
    return await res.json();
  }

  async function create(formData: FormData) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const res = await fetch("http://localhost:8080/api/v1/projects/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Update project failed");
    }
    return await res.json();
  }
  async function update(formData: FormData) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const res = await fetch("http://localhost:8080/api/v1/projects/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Update project failed");
    }
    await res.json();
  }

  async function deleteProject(id: string) {
    "use server";

    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch("http://localhost:8080/api/v1/projects/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);

      throw new Error(errData?.message || "Delete project failed");
    }
    await res.json();
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <ProjectDataTable
        data={data.data}
        getDetail={getDetail}
        create={create}
        update={update}
        deleteProject={deleteProject}
      />
    </div>
  );
}
