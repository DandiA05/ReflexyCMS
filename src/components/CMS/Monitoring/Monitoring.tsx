"use client";

import React, { useEffect, useState } from "react";

import DatePicker from "@/components/form/date-picker";
import Label from "../../form/Label";
import Select from "../../form/Select";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import AlertModal from "../../modal/AlertModal";
import { ChevronDownIcon } from "@/icons";
import axiosInstance from "@/lib/axios";

interface DashboardData {
  monthTransactions: number;
  monthRevenue: number;
  todayTransactions: number;
  todayRevenue: number;
  investor1Revenue: number;
  investor2Revenue: number;
  monthOverhead: number;
  monthProfit: number;
  profitMargin: number;
}

const Index = () => {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("monitoring/dashboard");
      setDashboardData(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeModal = () => setIsOpen(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
  };

  const handleReset = () => {
    setFilters({ status: "", startDate: "", endDate: "" });
  };

  return (
    <div className="">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Monitoring Transaksi
      </h1>

      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-white">
          Filter Transaksi
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="text-sm text-gray-500">Total Transaksi (Bulan Ini)</p>
          <p className="text-2xl font-semibold text-black dark:text-white">
            {loading ? "..." : dashboardData?.monthTransactions || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Total Pendapatan (Bulan Ini)</p>
          <p className="text-2xl font-semibold text-green-600">
            Rp{" "}
            {loading
              ? "..."
              : (dashboardData?.monthRevenue || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Transaksi Hari Ini</p>
          <p className="text-2xl font-semibold text-black dark:text-white">
            {loading ? "..." : dashboardData?.todayTransactions || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Pendapatan Hari Ini</p>
          <p className="text-2xl font-semibold text-green-600">
            Rp{" "}
            {loading
              ? "..."
              : (dashboardData?.todayRevenue || 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Investor Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Investor 1</p>
          <p className="text-xl font-semibold text-black dark:text-white">
            Rp{" "}
            {loading
              ? "..."
              : (dashboardData?.investor1Revenue || 0).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-400">Profit Sharing</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Investor 2</p>
          <p className="text-xl font-semibold text-black dark:text-white">
            Rp{" "}
            {loading
              ? "..."
              : (dashboardData?.investor2Revenue || 0).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-400">Profit Sharing</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Overhead Cost (Bulan Ini)</p>
          <p className="text-xl font-semibold text-black dark:text-white">
            Rp{" "}
            {loading
              ? "..."
              : (dashboardData?.monthOverhead || 0).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">Profit (Bulan Ini)</p>
          <p className="text-xl font-semibold text-blue-600">
            Rp{" "}
            {loading
              ? "..."
              : (dashboardData?.monthProfit || 0).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-400">
            Margin: {dashboardData?.profitMargin || 0}%
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
