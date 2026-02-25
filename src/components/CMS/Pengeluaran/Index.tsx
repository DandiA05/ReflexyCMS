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

interface OverheadCost {
  id: string;
  category: string;
  nominalProjection: string;
  nominalRealisasi: string | null;
  details: string;
  month: number;
  year: number;
  notes: string | null;
}

interface ProjectionSummary {
  summary: Record<string, number>;
  total: number;
  month: number;
  year: number;
}

const RealisasiPengeluaranPage = () => {
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);

  // Helper for formatting
  const formatCurrency = (value: string | number) => {
    if (value === "" || value === undefined || value === null) return "";
    const num =
      typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
    if (num === "") return "";
    return Number(num).toLocaleString("id-ID");
  };

  const parseNumber = (value: string) => {
    return value.replace(/\D/g, "");
  };

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Data
  const [categories, setCategories] = useState<string[]>([]);
  const [costList, setCostList] = useState<OverheadCost[]>([]);
  const [summary, setSummary] = useState<ProjectionSummary | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: "",
    nominalProjection: "",
    nominalRealisasi: "",
    details: "",
    notes: "",
  });

  // Projection quick-save state (for the top form)
  const [quickProjection, setQuickProjection] = useState({
    category: "",
    nominal: "",
  });

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
  }, [selectedMonth, selectedYear, isMounted]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/overhead-cost/categories");
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [listRes, summaryRes] = await Promise.all([
        axiosInstance.get(
          `/overhead-cost?month=${selectedMonth}&year=${selectedYear}`,
        ),
        axiosInstance.get(
          `/overhead-cost/projection/summary?month=${selectedMonth}&year=${selectedYear}`,
        ),
      ]);

      setCostList(listRes.data.data || []);
      setSummary(summaryRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch overhead data", err);
      setError("Gagal mengambil data pengeluaran.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-brand-500 h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  const openModal = (type: "create" | "edit", data?: OverheadCost) => {
    setModalType(type);
    if (type === "edit" && data) {
      setCurrentId(data.id);
      setFormData({
        category: data.category,
        nominalProjection: parseNumber(data.nominalProjection),
        nominalRealisasi: data.nominalRealisasi
          ? parseNumber(data.nominalRealisasi)
          : "",
        details: data.details,
        notes: data.notes || "",
      });
    } else {
      setCurrentId(null);
      setFormData({
        category: "",
        nominalProjection: "",
        nominalRealisasi: "",
        details: "",
        notes: "",
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
      category: formData.category,
      nominalProjection: Number(formData.nominalProjection),
      nominalRealisasi: formData.nominalRealisasi
        ? Number(formData.nominalRealisasi)
        : null,
      details: formData.details,
      month: selectedMonth,
      year: selectedYear,
      notes: formData.notes,
    };

    try {
      if (modalType === "create") {
        await axiosInstance.post("/overhead-cost", payload);
      } else {
        await axiosInstance.put(`/overhead-cost/${currentId}`, payload);
      }
      await fetchData();
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus data ini?")) {
      try {
        await axiosInstance.delete(`/overhead-cost/${id}`);
        fetchData();
      } catch (err) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const handleQuickProjectionSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickProjection.category || !quickProjection.nominal) return;

    setIsLoading(true);
    try {
      // Find if category already exists for this month
      const existing = costList.find(
        (c) => c.category === quickProjection.category,
      );
      const payload = {
        category: quickProjection.category,
        nominalProjection: Number(quickProjection.nominal),
        details:
          existing?.details ||
          `Biaya ${quickProjection.category} ${selectedMonth}/${selectedYear}`,
        month: selectedMonth,
        year: selectedYear,
      };

      if (existing) {
        await axiosInstance.put(`/overhead-cost/${existing.id}`, payload);
      } else {
        await axiosInstance.post("/overhead-cost", payload);
      }

      await fetchData();
      setQuickProjection({ category: "", nominal: "" });
    } catch (err) {
      alert("Gagal menyimpan proyeksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const totalActual = costList.reduce(
    (acc, item) => acc + Number(item.nominalRealisasi || 0),
    0,
  );
  const totalProjection = summary?.total || 0;
  const variance = totalActual - totalProjection;
  const variancePercentage =
    totalProjection > 0 ? ((variance / totalProjection) * 100).toFixed(1) : "0";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Overhead Cost
        </h1>

        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <Input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Projection Section */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Proyeksi Pengeluaran
        </h2>

        <form
          onSubmit={handleQuickProjectionSave}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <div>
            <Label>Kategori</Label>
            <select
              value={quickProjection.category}
              onChange={(e) => {
                const cat = e.target.value;
                const existingProjection = summary?.summary[cat] || 0;
                setQuickProjection({
                  category: cat,
                  nominal:
                    existingProjection > 0 ? existingProjection.toString() : "",
                });
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Nominal Proyeksi</Label>
            <Input
              value={formatCurrency(quickProjection.nominal)}
              onChange={(e) =>
                setQuickProjection({
                  ...quickProjection,
                  nominal: parseNumber(e.target.value),
                })
              }
              placeholder="Contoh: 2.500.000"
              className="mt-1"
            />
          </div>

          <div className="flex items-end">
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              Simpan Proyeksi
            </Button>
          </div>
        </form>

        {/* Projection Breakdown */}
        {summary && Object.keys(summary.summary).length > 0 && (
          <div className="mt-8 border-t border-gray-100 pt-6 dark:border-white/[0.05]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white">
              Ringkasan Proyeksi per Kategori
            </h3>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(summary.summary).map(([cat, val]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-white/5 dark:bg-white/[0.02]"
                >
                  <span className="text-xs text-gray-500">{cat}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    Rp {val.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500">Total Proyeksi</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  Rp {totalProjection.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500">Total Realisasi</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  Rp {totalActual.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-sm text-gray-500">Selisih (Variance)</p>
                <p
                  className={`text-xl font-bold ${variance >= 0 ? "text-error-500" : "text-success-500"}`}
                >
                  Rp {variance.toLocaleString("id-ID")}
                  <span className="ml-2 text-sm font-medium">
                    ({variancePercentage}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Detail Pengeluaran
          </h2>
          <Button
            size="sm"
            variant="primary"
            startIcon={<PlusIcon />}
            onClick={() => openModal("create")}
          >
            Tambah Realisasi
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
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
                  Kategori / Detail
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                >
                  Proyeksi
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                >
                  Realisasi
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-4 py-3 text-start font-medium text-gray-500"
                >
                  Selisih
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && costList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : costList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    Belum ada data di bulan ini
                  </TableCell>
                </TableRow>
              ) : (
                costList.map((item, index) => {
                  const itemVariance =
                    (Number(item.nominalRealisasi) || 0) -
                    Number(item.nominalProjection);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {item.category}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.details}
                        </div>
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 text-gray-500">
                        Rp{" "}
                        {Number(item.nominalProjection).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-theme-sm px-4 py-3 font-medium text-gray-500">
                        {item.nominalRealisasi
                          ? `Rp ${Number(item.nominalRealisasi).toLocaleString("id-ID")}`
                          : "-"}
                      </TableCell>
                      <TableCell
                        className={`text-theme-sm px-4 py-3 font-semibold ${itemVariance > 0 ? "text-red-500" : "text-green-500"}`}
                      >
                        {itemVariance === 0
                          ? "-"
                          : `Rp ${itemVariance.toLocaleString("id-ID")} `}
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
          {modalType === "create"
            ? "Tambah Data Overhead"
            : "Edit Data Overhead"}
        </h4>

        <form onSubmit={handleSave} className="grid gap-4">
          <div>
            <Label>Kategori</Label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Detail Keterangan</Label>
            <Input
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              placeholder="Contoh: Tagihan Listrik Desember"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nominal Proyeksi</Label>
              <Input
                value={formatCurrency(formData.nominalProjection)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nominalProjection: parseNumber(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Nominal Realisasi (Actual)</Label>
              <Input
                value={formatCurrency(formData.nominalRealisasi)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nominalRealisasi: parseNumber(e.target.value),
                  })
                }
                placeholder="Kosongkan jika belum ada"
              />
            </div>
          </div>

          <div>
            <Label>Catatan Tambahan</Label>
            <textarea
              className="min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Catatan..."
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

export default RealisasiPengeluaranPage;
