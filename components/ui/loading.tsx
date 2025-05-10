import React from "react";

function Loading() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default Loading;
