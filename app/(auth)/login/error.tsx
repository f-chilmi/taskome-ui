"use client";

import ErrorComponent from "@/components/error";

export default function error(errorObj: Error) {
  console.log("errorObj!", errorObj);
  return <ErrorComponent />;
}
