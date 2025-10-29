import TransaksiPage from "@/components/transaksi/Transaksi";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Transaksi",
  
};
export default function page() {
  return (
    <div>
      <TransaksiPage />
    </div>
  );
}
