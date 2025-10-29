import type { Metadata } from "next";
import React from "react";
import TransaksiPage from "@/components/transaksi/Transaksi";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div >
      <TransaksiPage />
    </div>
  );
}
