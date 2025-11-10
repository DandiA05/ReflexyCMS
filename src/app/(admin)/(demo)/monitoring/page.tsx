import Monitoring from "@/components/CMS/Monitoring/Monitoring";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Monitoring",
  
};
export default function page() {
  return (
    <div>
      <Monitoring />
    </div>
  );
}
