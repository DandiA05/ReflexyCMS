import MasterLayananPage from "@/components/CMS/Master/Layanan/Index";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Master Layanan",
  
};
export default function page() {
  return (
    <div>
      <MasterLayananPage />
    </div>
  );
}
