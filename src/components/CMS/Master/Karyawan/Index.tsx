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

interface Karyawan {
  id: number;
  nama: string;
  gaji: number;
}

const MasterKaryawanPage = () => {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([
    { id: 1, nama: "Budi Santoso", gaji: 4500000 },
    { id: 2, nama: "Siti Rahma", gaji: 5000000 },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newKaryawan, setNewKaryawan] = useState({ nama: "", gaji: "" });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(karyawanList.length / itemsPerPage);
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
    setNewKaryawan({ nama: "", gaji: "" });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKaryawan.nama || !newKaryawan.gaji) return;
    const newItem: Karyawan = {
      id: karyawanList.length + 1,
      nama: newKaryawan.nama,
      gaji: Number(newKaryawan.gaji),
    };
    setKaryawanList([...karyawanList, newItem]);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus karyawan ini?")) {
      setKaryawanList(karyawanList.filter((k) => k.id !== id));
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Master Karyawan
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
                    Nama Karyawan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Gaji
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
                {karyawanList.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      {item.nama}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                      Rp {item.gaji.toLocaleString("id-ID")}
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
                {karyawanList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-gray-500"
                    >
                      Tidak ada data karyawan
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
            {Math.min(startIndex + itemsPerPage, karyawanList.length)} dari{" "}
            {karyawanList.length} data
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

      {/* Modal Tambah Karyawan */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          Tambah Karyawan
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Nama Karyawan</Label>
            <input
              type="text"
              value={newKaryawan.nama}
              onChange={(e) =>
                setNewKaryawan({ ...newKaryawan, nama: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan nama karyawan"
              required
            />
          </div>

          <div>
            <Label>Gaji</Label>
            <input
              type="number"
              value={newKaryawan.gaji}
              onChange={(e) =>
                setNewKaryawan({ ...newKaryawan, gaji: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
              placeholder="Masukkan gaji"
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

export default MasterKaryawanPage;
