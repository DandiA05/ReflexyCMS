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

interface Pelanggan {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  totalSpent: string | number;
  visits: number;
  active: boolean;
}

const MasterPelangganPage = () => {
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    category: "regular",
  });

  // Pagination State
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/customers");
      setPelangganList(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch customers", err);
      setError("Gagal mengambil data pelanggan.");
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

  const openModal = (type: "create" | "edit", data?: Pelanggan) => {
    setModalType(type);
    if (type === "edit" && data) {
      setCurrentId(data.id);
      setFormData({
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        category: data.category.toLowerCase(),
      });
    } else {
      setCurrentId(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        category: "regular",
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
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      category: formData.category,
    };

    try {
      if (modalType === "create") {
        await axiosInstance.post("/customers", payload);
      } else if (modalType === "edit" && currentId) {
        await axiosInstance.put(`/customers/${currentId}`, payload);
      }

      await fetchCustomers();
      closeModal();
    } catch (err) {
      console.error("Error saving customer", err);
      setError("Gagal menyimpan data pelanggan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus pelanggan ini?")) {
      try {
        await axiosInstance.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer", err);
        alert("Gagal menghapus data pelanggan.");
      }
    }
  };

  const totalPages = Math.ceil(pelangganList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = pelangganList.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Master Pelanggan
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
          <div className="min-w-[800px]">
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
                    Kontak
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Kategori
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Kunjungan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Total Spend
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
                {isLoading && pelangganList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-6 text-center text-gray-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.address}
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {item.phone}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            item.category.toLowerCase() === "vip"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {item.category.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        {item.visits} Kali
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        Rp {Number(item.totalSpent).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
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

                {!isLoading && pelangganList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          {modalType === "create" ? "Tambah Pelanggan" : "Edit Pelanggan"}
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
              placeholder="Contoh: Jane Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>No. HP</Label>
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
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="jane@example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label>Alamat</Label>
            <textarea
              className="focus:border-brand-300 focus:ring-brand-500/10 min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Alamat lengkap..."
            />
          </div>

          <div>
            <Label>Kategori</Label>
            <select
              className="focus:border-brand-300 focus:ring-brand-500/10 w-full rounded-lg border px-3 py-2 text-sm focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="regular">Regular</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          {error && <p className="text-error-500 text-sm">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={closeModal}
              type="button"
            >
              Batal
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MasterPelangganPage;
