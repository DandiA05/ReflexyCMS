import MasterKaryawanPage from "@/components/CMS/Master/Karyawan/Index";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Master Karyawan",
  
};
export default function page() {
  return (
    <div>
      <MasterKaryawanPage />
    </div>
  );
}
