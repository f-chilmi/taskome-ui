"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";

function ToastServer({ message }: { message: string }) {
  useEffect(() => {
    console.log("called");
    toast(message);
  }, [message]);

  //   toast(message);
  return <></>;
}

export default ToastServer;
