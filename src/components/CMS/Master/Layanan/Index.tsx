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

interface Layanan {
  id: string;
  name: string;
  description: string;
  price: string | number; // Handling both potential formats
  duration: number;
  active: boolean;
}

const MasterLayananPage = () => {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  // Pagination State (Client-side for now based on API response)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/services");
      // Assuming response.data is { data: [...], total: ... } as per requirement
      setLayananList(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch services", err);
      setError("Gagal mengambil data layanan.");
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

  const openModal = (type: "create" | "edit", data?: Layanan) => {
    setModalType(type);
    if (type === "edit" && data) {
      setCurrentId(data.id);
      setFormData({
        name: data.name,
        description: data.description || "",
        price: data.price.toString(),
        duration: data.duration?.toString() || "",
      });
    } else {
      setCurrentId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
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

    // Convert types for payload
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
    };

    try {
      if (modalType === "create") {
        await axiosInstance.post("/services", payload);
      } else if (modalType === "edit" && currentId) {
        await axiosInstance.put(`/services/${currentId}`, payload);
      }

      // Refresh data
      await fetchServices();
      closeModal();
    } catch (err) {
      console.error("Error saving service", err);
      setError("Gagal menyimpan layanan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus layanan ini?")) {
      try {
        await axiosInstance.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error("Error deleting service", err);
        alert("Gagal menghapus layanan.");
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(layananList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = layananList.slice(startIndex, startIndex + itemsPerPage);

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
            onClick={() => openModal("create")}
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
                    Durasi
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
                {isLoading && layananList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        {item.duration} Menit
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        Rp {Number(item.price).toLocaleString("id-ID")}
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

                {!isLoading && layananList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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

      {/* Modal Tambah/Edit Layanan */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          {modalType === "create" ? "Tambah Layanan" : "Edit Layanan"}
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Nama Layanan</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Contoh: Haircut Premium"
              required
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Harga (Rp)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label>Durasi (Menit)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="60"
                required
              />
            </div>
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              className="focus:border-brand-300 focus:ring-brand-500/10 min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Deskripsi layanan..."
            />
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

export default MasterLayananPage;
