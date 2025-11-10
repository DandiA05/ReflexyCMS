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
    { id: 2, kategori: "Gaji Karyawan", nominal: 12000000, bulan: "Januari 2025" },
    { id: 3, kategori: "Internet", nominal: 800000, bulan: "Januari 2025" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newPengeluaran, setNewPengeluaran] = useState({
    kategori: "",
    nominal: "",
    bulan: "",
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(pengeluaranList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
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
    if (!newPengeluaran.kategori || !newPengeluaran.nominal || !newPengeluaran.bulan) return;

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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Overhead Cost Perbulan
      </h1>

      {/* Table Card */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className=" flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/[0.05]">
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
                setNewPengeluaran({ ...newPengeluaran, kategori: e.target.value })
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
                setNewPengeluaran({ ...newPengeluaran, nominal: e.target.value })
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
