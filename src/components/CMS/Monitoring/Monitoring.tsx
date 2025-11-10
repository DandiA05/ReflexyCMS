"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { transaksiList } from "./Data";
import DatePicker from "@/components/form/date-picker";
import Label from "../../form/Label";
import Select from "../../form/Select";
import { PlusIcon, ChevronDownIcon } from "@/icons";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Pagination from "../../tables/Pagination";
import AlertModal from "../../modal/AlertModal";

const Index = () => {
  const [filters, setFilters] = useState({
    layanan: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 🧠 TODO: Simpan transaksi baru ke data
    closeModal();
  };

  const investorData = [
    { name: "Investor 1", percent: 10 },
    { name: "Investor 2", percent: 90 },
  ];

  // --- Pagination Logic ---
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = transaksiList.filter((trx) => {
    const matchLayanan = filters.layanan
      ? trx.layanan === filters.layanan
      : true;
    const matchStatus = filters.status ? trx.status === filters.status : true;
    const matchTanggal =
      (!filters.startDate || trx.tanggal >= filters.startDate) &&
      (!filters.endDate || trx.tanggal <= filters.endDate);

    return matchLayanan && matchStatus && matchTanggal;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ layanan: "", status: "", startDate: "", endDate: "" });
  };

  useEffect(() => {
    const total = filteredData.length;
    const pendapatan = filteredData.reduce((sum, t) => sum + t.harga, 0);
    setTotalTransaksi(total);
    setTotalPendapatan(pendapatan);
  }, [filteredData]);

  return (
    <div className="">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Monitoring Transaksi
      </h1>

      {/* 🔍 Filter Card */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-white">
          Filter Transaksi
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Layanan */}
          <div>
            <Label>Layanan</Label>
            <div className="relative">
              <Select
                value={filters.layanan}
                options={[
                  { value: "Refleksi 60 Menit", label: "Refleksi 60 Menit" },
                  { value: "Refleksi 90 Menit", label: "Refleksi 90 Menit" },
                  { value: "Pijit Punggung", label: "Pijit Punggung" },
                ]}
                placeholder="Semua"
                onChange={(value) => setFilters({ ...filters, layanan: value })}
                className="dark:bg-dark-900"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          <div>
            <Label>Start Date</Label>
            <DatePicker
              defaultDate={filters.startDate}
              id="start-date"
              label=""
              placeholder="Select start date"
              onChange={(_, currentDateString) =>
                setFilters({ ...filters, startDate: currentDateString })
              }
            />
          </div>
          <div>
            <Label>End Date</Label>
            <DatePicker
              defaultDate={filters.endDate}
              id="end-date"
              label=""
              placeholder="Select end date"
              onChange={(_, currentDateString) =>
                setFilters({ ...filters, endDate: currentDateString })
              }
            />
          </div>
          <div>
            <Label>Status</Label>
            <div className="relative">
              <Select
                value={filters.status}
                options={[
                  { value: "Selesai", label: "Selesai" },
                  { value: "Proses", label: "Proses" },
                  { value: "Batal", label: "Batal" },
                ]}
                placeholder="Semua"
                onChange={(value) => setFilters({ ...filters, status: value })}
                className="dark:bg-dark-900"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button size="sm" variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-2xl font-semibold text-black dark:text-white">
            {totalTransaksi}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Total Pendapatan</p>
          <p className="text-2xl font-semibold text-green-600">
            Rp {totalPendapatan.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Investor Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {investorData.map((inv) => (
          <div
            key={inv.name}
            className="rounded-xl bg-white p-5 shadow dark:bg-gray-800"
          >
            <p className="text-sm text-gray-500">{inv.name}</p>
            <p className="text-xl font-semibold text-black dark:text-white">
              Rp{" "}
              {((inv.percent / 100) * totalPendapatan).toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-gray-400">{inv.percent}% dari total</p>
          </div>
        ))}

        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Overhead Cost (Proyeksi)</p>
          <p className="text-xl font-semibold text-black dark:text-white">
            Rp {(3000000).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Overhead Cost (Realisasi)</p>
          <p className="text-xl font-semibold text-black dark:text-white">
            Rp {(2500000).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Table Transaksi + Pagination (tetap sama seperti sebelumnya) */}
      {/* ... */}
      {/* <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-sm text-gray-600">
              Tampilkan:
            </label>
            <select
              id="limit"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="primary"
            startIcon={<PlusIcon />}
            onClick={openModal}
          >
            Tambah
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table className="hover">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Pelanggan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Tanggal
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Therapist
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Layanan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-end font-medium text-gray-500"
                  >
                    Harga
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentData.map((trx, index) => (
                  <TableRow key={trx.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {trx.pelanggan}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {trx.tanggal}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {trx.therapist}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {trx.layanan}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-right font-medium text-black dark:text-white">
                      Rp {trx.harga.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          trx.status === "Selesai"
                            ? "success"
                            : trx.status === "Proses"
                              ? "warning"
                              : "error"
                        }
                      >
                        {trx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500">
                      <Button
                        size="xs"
                        variant="warning"
                        onClick={() => setIsOpenAlert(true)}
                      >
                        Print
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          <p className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
            Menampilkan {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
            {filteredData.length} data
          </p>

          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div> */}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
          Tambah Transaksi
        </h4>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <Label>Pelanggan</Label>
            <input
              type="text"
              name="pelanggan"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Nama pelanggan"
            />
          </div>

          <div>
            <Label>Tanggal</Label>
            <DatePicker id="add-date" placeholder="Pilih tanggal" />
          </div>

          <div>
            <Label>Therapist</Label>
            <input
              type="text"
              name="therapist"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Nama therapist"
            />
          </div>

          <div>
            <Label>Layanan</Label>
            <Select
              onChange={() => console.log("layanan")}
              options={[
                { value: "Refleksi 60 Menit", label: "Refleksi 60 Menit" },
                { value: "Refleksi 90 Menit", label: "Refleksi 90 Menit" },
                { value: "Pijit Punggung", label: "Pijit Punggung" },
              ]}
              placeholder="Pilih layanan"
            />
          </div>

          <div>
            <Label>Harga</Label>
            <input
              type="number"
              name="harga"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Harga"
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              onChange={() => console.log("status")}
              options={[
                { value: "Selesai", label: "Selesai" },
                { value: "Proses", label: "Proses" },
                { value: "Batal", label: "Batal" },
              ]}
              placeholder="Pilih status"
            />
          </div>

          <div className="col-span-2 mt-8 flex w-full items-center justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button size="sm">Simpan</Button>
          </div>
        </form>
      </Modal>

      <AlertModal
        isOpen={isOpenAlert}
        onClose={() => setIsOpenAlert(false)}
        type="success"
        title="Transaksi Berhasil Diprint"
        message="Check Print Transaksi"
        confirmText="OK"
        onConfirm={() => console.log("Confirmed!")}
      />
    </div>
  );
};

export default Index;
