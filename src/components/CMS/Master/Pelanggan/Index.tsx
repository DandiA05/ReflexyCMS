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

interface Pelanggan {
  id: number;
  nama: string;
  noHp: string;
}

const MasterPelangganPage = () => {
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([
    { id: 1, nama: "Andi Prasetyo", noHp: "081234567890" },
    { id: 2, nama: "Dewi Lestari", noHp: "082198765432" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newPelanggan, setNewPelanggan] = useState({ nama: "", noHp: "" });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(pelangganList.length / itemsPerPage);
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
    setNewPelanggan({ nama: "", noHp: "" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPelanggan.nama || !newPelanggan.noHp) return;

    const newItem: Pelanggan = {
      id: pelangganList.length + 1,
      nama: newPelanggan.nama,
      noHp: newPelanggan.noHp,
    };

    setPelangganList([...pelangganList, newItem]);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus pelanggan ini?")) {
      setPelangganList(pelangganList.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Master Pelanggan
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
                    Nama Pelanggan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    No. HP
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
                {pelangganList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {item.nama}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {item.noHp}
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
                {pelangganList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-gray-500"
                    >
                      Tidak ada data pelanggan
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
            {Math.min(startIndex + itemsPerPage, pelangganList.length)} dari{" "}
            {pelangganList.length} data
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

      {/* Modal Tambah Pelanggan */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          Tambah Pelanggan
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Nama Pelanggan</Label>
            <input
              type="text"
              value={newPelanggan.nama}
              onChange={(e) =>
                setNewPelanggan({ ...newPelanggan, nama: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan nama pelanggan"
              required
            />
          </div>

          <div>
            <Label>No. HP</Label>
            <input
              type="tel"
              value={newPelanggan.noHp}
              onChange={(e) =>
                setNewPelanggan({ ...newPelanggan, noHp: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan nomor HP"
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

export default MasterPelangganPage;
