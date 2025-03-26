"use client";

import React from "react";
import { toast } from "sonner";

export default function TestToastProvider() {
  // Function to trigger a test toast
  const triggerTestToast = () => {
    toast.success("Test toast success!");
    console.log("Toast triggered");
  };

  return (
    <div style={{ padding: "20px", marginTop: "20px", textAlign: "center" }}>
      <button
        onClick={triggerTestToast}
        style={{
          padding: "10px 15px",
          backgroundColor: "#3f51b5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Test Toast
      </button>
    </div>
  );
}
