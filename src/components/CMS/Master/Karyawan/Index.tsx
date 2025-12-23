"use client";

import React, { useState, useEffect } from "react";
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
import Input from "@/components/form/input/InputField";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";
import Pagination from "@/components/tables/Pagination";
import axiosInstance from "@/lib/axios";

interface Karyawan {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: string | number;
  joinDate?: string;
  active: boolean;
}

const MasterKaryawanPage = () => {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "Kasir",
    salary: "",
  });

  // Pagination State
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/employees");
      setKaryawanList(response.data.data || []); 
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setError("Gagal mengambil data karyawan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openModal = (type: "create" | "edit", data?: Karyawan) => {
    setModalType(type);
    if (type === "edit" && data) {
      setCurrentId(data.id);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        salary: data.salary.toString(),
      });
    } else {
      setCurrentId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "Kasir",
        salary: "",
      });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      salary: Number(formData.salary),
    };

    try {
      if (modalType === "create") {
        await axiosInstance.post("/employees", payload);
      } else if (modalType === "edit" && currentId) {
        await axiosInstance.put(`/employees/${currentId}`, payload);
      }
      
      await fetchEmployees();
      closeModal();
    } catch (err: any) {
      console.error("Error saving employee", err);
      setError(err.response?.data?.message || "Gagal menyimpan data karyawan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus karyawan ini?")) {
      try {
        await axiosInstance.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error("Error deleting employee", err);
        alert("Gagal menghapus data karyawan.");
      }
    }
  };

  const totalPages = Math.ceil(karyawanList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = karyawanList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Master Karyawan
      </h1>

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
            onClick={() => openModal("create")}
          >
            Tambah
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table className="hover">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs">No</TableCell>
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs">Karyawan</TableCell>
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs">Kontak</TableCell>
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs">Posisi</TableCell>
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs">Gaji</TableCell>
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-center text-theme-xs">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading && karyawanList.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={6} className="py-6 text-center text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                        <div className="font-medium text-gray-800 dark:text-white/90">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.email}</div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                        {item.phone}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                        {item.position}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                        Rp {Number(item.salary).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            size="xs"
                            variant="warning"
                            startIcon={<PencilIcon />}
                            onClick={() => openModal("edit", item)}
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
                  ))
                )}
                
                {!isLoading && karyawanList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          {modalType === "create" ? "Tambah Karyawan" : "Edit Karyawan"}
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Nama Lengkap</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Contoh: John Doe"
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@pos.com"
              required
            />
          </div>

          <div>
            <Label>No. Telepon</Label>
            <Input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="081234567890"
              required
            />
          </div>

          <div>
            <Label>Posisi</Label>
            <Input
              type="text"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Contoh: Hairstylist"
              required
            />
          </div>

          <div>
            <Label>Gaji (Rp)</Label>
            <Input
              type="number"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              placeholder="0"
              required
            />
          </div>

          {error && <p className="text-sm text-error-500">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal} type="button">
              Batal
            </Button>
            <Button size="sm" variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterKaryawanPage;
