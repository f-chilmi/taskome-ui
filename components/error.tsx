"use client";

import { CloudAlertIcon } from "lucide-react";

export default function ErrorComponent() {
  return (
    <div
      className={
        "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-[4px] "
      }
    >
      <CloudAlertIcon />
      <p className="text-body-bold text-primary_500 ">Something went wrong</p>
    </div>
  );
}
