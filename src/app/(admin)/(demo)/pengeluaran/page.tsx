import RealisasiPengeluaranPage from "@/components/CMS/Pengeluaran/Index";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pengeluaran",
  
};
export default function page() {
  return (
    <div>
      <RealisasiPengeluaranPage />
    </div>
  );
}
