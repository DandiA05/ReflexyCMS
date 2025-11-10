import MasterPelangganPage from "@/components/CMS/Master/Pelanggan/Index";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Master Pelanggan",
  
};
export default function page() {
  return (
    <div>
      <MasterPelangganPage />
    </div>
  );
}
