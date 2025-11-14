"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";
import Pagination from "@/components/tables/Pagination";

interface Pengeluaran {
  id: number;
  kategori: string;
  nominal: number;
  bulan: string;
}

const RealisasiPengeluaranPage = () => {
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>([
    { id: 1, kategori: "Listrik", nominal: 2500000, bulan: "Januari 2025" },
    {
      id: 2,
      kategori: "Gaji Karyawan",
      nominal: 12000000,
      bulan: "Januari 2025",
    },
    { id: 3, kategori: "Internet", nominal: 800000, bulan: "Januari 2025" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newPengeluaran, setNewPengeluaran] = useState({
    kategori: "",
    nominal: "",
    bulan: "",
  });

  const [filterBulan, setFilterBulan] = useState("");
  const [filterKategori, setFilterKategori] = useState("");

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(pengeluaranList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setNewPengeluaran({ kategori: "", nominal: "", bulan: "" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPengeluaran.kategori ||
      !newPengeluaran.nominal ||
      !newPengeluaran.bulan
    )
      return;

    const newItem: Pengeluaran = {
      id: pengeluaranList.length + 1,
      kategori: newPengeluaran.kategori,
      nominal: Number(newPengeluaran.nominal),
      bulan: newPengeluaran.bulan,
    };

    setPengeluaranList([...pengeluaranList, newItem]);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus pengeluaran ini?")) {
      setPengeluaranList(pengeluaranList.filter((p) => p.id !== id));
    }
  };

  // State Proyeksi
  const [proyeksi, setProyeksi] = useState<Record<string, number>>({
    Listrik: 0,
    "Gaji Karyawan": 0,
    Internet: 0,
    Air: 0,
    ATK: 0,
    Lainnya: 0,
  });

  // State form
  const [formProyeksi, setFormProyeksi] = useState({
    kategori: "",
    nominal: "",
  });

  // Jika kategori dipilih & sudah ada nilai → auto isi
  const handleKategoriChange = (value: string) => {
    setFormProyeksi({
      ...formProyeksi,
      kategori: value,
      nominal: proyeksi[value] ? proyeksi[value].toString() : "",
    });
  };

  const saveProyeksi = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formProyeksi.kategori || !formProyeksi.nominal) return;

    setProyeksi({
      ...proyeksi,
      [formProyeksi.kategori]: Number(formProyeksi.nominal),
    });

    alert("Proyeksi disimpan / diperbarui");
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Overhead Cost Perbulan
      </h1>

      {/* Card Proyeksi Pengeluaran */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Proyeksi Pengeluaran
        </h2>

        <form onSubmit={saveProyeksi} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Kategori Over Head Cost</Label>
            <select
              value={formProyeksi.kategori}
              onChange={(e) => handleKategoriChange(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              {Object.keys(proyeksi).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Nominal Proyeksi</Label>
            <input
              type="number"
              value={formProyeksi.nominal}
              onChange={(e) =>
                setFormProyeksi({ ...formProyeksi, nominal: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan nominal"
            />
          </div>

          <div />

          <div className="">
            <Button size="sm" variant="primary" className="w-full">
              {proyeksi[formProyeksi.kategori]
                ? "Update Proyeksi"
                : "Simpan Proyeksi"}
            </Button>
          </div>
        </form>

        {/* Tampilkan ringkasan proyeksi (opsional) */}
        <div className="mt-6 border-t pt-5">
          <h3 className="mb-3 text-base font-semibold text-gray-800 dark:text-gray-200">
            Ringkasan Proyeksi
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(proyeksi).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-white/10 dark:bg-gray-900/40"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {k}
                </span>

                <span
                  className={`text-sm font-semibold ${
                    v ? "text-gray-900 dark:text-white" : "text-gray-400"
                  }`}
                >
                  {v ? "Rp " + v.toLocaleString("id-ID") : "-"}
                </span>
              </div>
            ))}
          </div>
          {/* Total Proyeksi */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
              <p className="text-sm text-gray-500">
                Total Proyeksi Pengeluaran
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                Rp{" "}
                {Object.values(proyeksi)
                  .reduce((acc, val) => acc + (Number(val) || 0), 0)
                  .toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Realisasi Pengeluaran
          </h2>
          <Button
            size="sm"
            variant="primary"
            startIcon={<PlusIcon />}
            onClick={openModal}
          >
            Tambah
          </Button>
        </div>

        <div className="flex items-center border-b border-gray-100 pb-4 dark:border-white/[0.05] gap-8 pb-8">
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

          <div className="flex flex-grow items-center gap-2">
            <label htmlFor="limit" className="text-sm text-gray-600">
              Kategori:
            </label>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
            >
              <option value="">Semua Kategori</option>
              <option value="Listrik">Listrik</option>
              <option value="Gaji Karyawan">Gaji Karyawan</option>
              <option value="Internet">Internet</option>
              <option value="Air">Air</option>
              <option value="ATK">ATK</option>
            </select>
          </div>

          <div className="flex flex-grow  items-center gap-2">
            <label htmlFor="limit" className="text-sm text-gray-600">
              Bulan:
            </label>
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
            >
              <option value="">Semua Bulan</option>
              {Array.from(new Set(pengeluaranList.map((p) => p.bulan))).map(
                (bulan) => (
                  <option key={bulan} value={bulan}>
                    {bulan}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
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
                    Kategori Over Head Cost
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Nominal Realisasi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Bulan
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
                {pengeluaranList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {item.kategori}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {item.bulan}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="xs"
                          variant="warning"
                          startIcon={<PencilIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="danger"
                          startIcon={<TrashBinIcon />}
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pengeluaranList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-gray-500"
                    >
                      Tidak ada data pengeluaran
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          <p className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
            Menampilkan {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, pengeluaranList.length)} dari{" "}
            {pengeluaranList.length} data
          </p>

          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Modal Tambah Pengeluaran */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          Tambah Pengeluaran
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Kategori Over Head Cost</Label>
            <select
              value={newPengeluaran.kategori}
              onChange={(e) =>
                setNewPengeluaran({
                  ...newPengeluaran,
                  kategori: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Listrik">Listrik</option>
              <option value="Gaji Karyawan">Gaji Karyawan</option>
              <option value="Internet">Internet</option>
              <option value="Air">Air</option>
              <option value="ATK">ATK</option>
            </select>
          </div>

          <div>
            <Label>Nominal Realisasi</Label>
            <input
              type="number"
              value={newPengeluaran.nominal}
              onChange={(e) =>
                setNewPengeluaran({
                  ...newPengeluaran,
                  nominal: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan nominal"
              required
            />
          </div>

          <div>
            <Label>Bulan</Label>
            <input
              type="text"
              value={newPengeluaran.bulan}
              onChange={(e) =>
                setNewPengeluaran({ ...newPengeluaran, bulan: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Contoh: Januari 2025"
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button size="sm" variant="primary">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RealisasiPengeluaranPage;
