import { SectionCards } from "@/components/section-cards";
import { API } from "@/lib/contants";

import dataa from "./data.json";
import { DataTable } from "@/components/data-table";

export default async function Page() {
  const res = await fetch(API + "/tasks/stats", {
    next: { tags: ["tasks"] },
  });
  const data = await res.json();
  console.log(data);
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards data={data.data} />

      <DataTable data={dataa} />
    </div>
  );
}
