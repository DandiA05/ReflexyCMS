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

interface Layanan {
  id: number;
  nama: string;
  harga: number;
}

const MasterLayananPage = () => {
  const [layananList, setLayananList] = useState<Layanan[]>([
    { id: 1, nama: "Refleksi 60 Menit", harga: 80000 },
    { id: 2, nama: "Refleksi 90 Menit", harga: 120000 },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newLayanan, setNewLayanan] = useState({ nama: "", harga: "" });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(layananList.length / itemsPerPage);
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
    setNewLayanan({ nama: "", harga: "" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayanan.nama || !newLayanan.harga) return;
    const newItem: Layanan = {
      id: layananList.length + 1,
      nama: newLayanan.nama,
      harga: Number(newLayanan.harga),
    };
    setLayananList([...layananList, newItem]);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus layanan ini?")) {
      setLayananList(layananList.filter((l) => l.id !== id));
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Master Layanan
      </h1>

      {/* Table Card */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/[0.05]">
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
          <div className="min-w-[600px]">
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
                    Layanan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Harga
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
                {layananList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {item.nama}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      Rp {item.harga.toLocaleString("id-ID")}
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
                {layananList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-gray-500"
                    >
                      Tidak ada data layanan
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
            {Math.min(startIndex + itemsPerPage, layananList.length)} dari{" "}
            {layananList.length} data
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

      {/* Modal Tambah Layanan */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          Tambah Layanan
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Nama Layanan</Label>
            <input
              type="text"
              value={newLayanan.nama}
              onChange={(e) =>
                setNewLayanan({ ...newLayanan, nama: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan nama layanan"
              required
            />
          </div>

          <div>
            <Label>Harga</Label>
            <input
              type="number"
              value={newLayanan.harga}
              onChange={(e) =>
                setNewLayanan({ ...newLayanan, harga: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan harga"
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

export default MasterLayananPage;
