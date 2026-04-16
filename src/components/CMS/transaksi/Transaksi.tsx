"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import DatePicker from "@/components/form/date-picker";
import Label from "../../form/Label";
import Select from "../../form/Select";
import { PlusIcon, ChevronDownIcon, TrashBinIcon } from "@/icons";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Pagination from "../../tables/Pagination";
import AlertModal from "../../modal/AlertModal";
import axiosInstance from "@/lib/axios";
import Input from "@/components/form/input/InputField";
import { useAuthStore } from "@/store/authStore";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  salary: string | number;
}

interface Service {
  id: string;
  name: string;
  price: string;
}

interface TransactionItem {
  price: number;
  quantity: number;
  serviceId: string | number;
  serviceName: string;
}

interface Transaction {
  id: string;
  transactionNumber: string;
  customerId: string;
  employeeId: string;
  subtotal: string;
  tax: string;
  total: string;
  paymentMethod: string;
  status: string;
  notes: string | null;
  items: TransactionItem[] | string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  employee?: {
    id: string;
    name: string;
  };
  commissionAmount?: number;
}

const TransaksiPage = () => {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState({
    customerId: "",
    employeeId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: "",
    employeeId: "",
    paymentMethod: "cash",
    status: "completed",
    notes: "",
  });

  const [items, setItems] = useState<TransactionItem[]>([]);

  // Statistics from API
  const [summaryTotal, setSummaryTotal] = useState(0);

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [custRes, empRes, servRes] = await Promise.all([
        axiosInstance.get("/customers"),
        axiosInstance.get("/employees"),
        axiosInstance.get("/services"),
      ]);
      setCustomers(custRes.data.data || []);
      setEmployees(empRes.data.data || []);
      setServices(servRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.customerId) params.append("customerId", filters.customerId);
      if (filters.employeeId) params.append("employeeId", filters.employeeId);
      if (filters.status) params.append("status", filters.status);

      const response = await axiosInstance.get(
        `/transactions?${params.toString()}`,
      );
      const parsedTransactions = (response.data.data || []).map(
        (trx: Transaction) => ({
          ...trx,
          items:
            typeof trx.items === "string"
              ? JSON.parse(trx.items)
              : trx.items || [],
        }),
      );
      setTransactions(parsedTransactions);
      setSummaryTotal(response.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setIsMounted(true);
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (isMounted) {
      fetchTransactions();
    }
  }, [fetchTransactions, isMounted]);

  const openModal = (type: "create" | "edit", data?: Transaction) => {
    setModalType(type);
    if (type === "edit" && data) {
      setCurrentId(data.id);
      setFormData({
        customerId: data.customerId,
        employeeId: data.employeeId,
        paymentMethod: data.paymentMethod,
        status: data.status,
        notes: data.notes || "",
      });
      const parsedItems =
        typeof data.items === "string" ? JSON.parse(data.items) : data.items;

      setItems(
        (parsedItems || []).map((item: TransactionItem) => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      );
    } else {
      setCurrentId(null);
      setFormData({
        customerId: "",
        employeeId: "",
        paymentMethod: "cash",
        status: "completed",
        notes: "",
      });
      setItems([{ serviceId: "", serviceName: "", price: 0, quantity: 1 }]);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      { serviceId: "", serviceName: "", price: 0, quantity: 1 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof TransactionItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    if (field === "serviceId") {
      const service = services.find((s) => s.id === value.toString());
      if (service) {
        newItems[index] = {
          ...newItems[index],
          serviceId: value,
          serviceName: service.name,
          price: Number(service.price),
        };
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const subtotal = calculateSubtotal();
    const tax = 0;
    const total = subtotal;

    const payload = {
      ...formData,
      subtotal,
      tax,
      total,
      items: items.filter((item) => item.serviceId !== ""),
    };

    try {
      if (modalType === "create") {
        await axiosInstance.post("/transactions", payload);
      } else {
        await axiosInstance.put(`/transactions/${currentId}`, payload);
      }
      fetchTransactions();
      closeModal();
    } catch (err) {
      console.error("Failed to save transaction", err);
      alert("Gagal menyimpan transaksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus transaksi ini?")) {
      try {
        await axiosInstance.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error("Failed to delete transaction", err);
        alert("Gagal menghapus transaksi.");
      }
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = transactions.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // --- Commission Summary Logic ---
  const commissionSummary = transactions.reduce(
    (acc, trx) => {
      if (trx.employee && trx.commissionAmount) {
        const empId = trx.employee.id;
        if (!acc[empId]) {
          const empData = employees.find((e) => e.id === empId);
          acc[empId] = {
            name: trx.employee.name,
            total: 0,
            count: 0,
            salary: empData?.salary || 0,
          };
        }
        acc[empId].total += Number(trx.commissionAmount);
        acc[empId].count += 1;
      }
      return acc;
    },
    {} as Record<
      string,
      { name: string; total: number; count: number; salary: number | string }
    >,
  );

  const handleReset = () => {
    setFilters({
      customerId: "",
      employeeId: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  if (!isMounted) return null;

  return (
    <div className="">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Data Transaksi
      </h1>

      {/* 🔍 Filter Card */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-white">
          Filter Transaksi
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label>Pelanggan</Label>
            <div className="relative">
              <Select
                value={filters.customerId}
                options={customers.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Semua Pelanggan"
                onChange={(value) =>
                  setFilters({ ...filters, customerId: value })
                }
                className="dark:bg-dark-900"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          <div>
            <Label>Therapist</Label>
            <div className="relative">
              <Select
                value={filters.employeeId}
                options={employees.map((e) => ({ value: e.id, label: e.name }))}
                placeholder="Semua Therapist"
                onChange={(value) =>
                  setFilters({ ...filters, employeeId: value })
                }
                className="dark:bg-dark-900"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
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
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
                placeholder="Semua Status"
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
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-2xl font-semibold text-black dark:text-white">
            {transactions.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow dark:bg-gray-800">
          <p className="text-sm text-gray-500">
            Total Pendapatan (Periode Ini)
          </p>
          <p className="text-2xl font-semibold text-green-600">
            Rp {summaryTotal.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Table Transaksi */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
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
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={99999}>All</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="primary"
            startIcon={<PlusIcon />}
            onClick={() => openModal("create")}
          >
            Tambah Transaksi
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table className="hover">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Nomor TRX
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Pelanggan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Therapist
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-end font-medium text-gray-500"
                  >
                    Komisi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Tanggal
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Subtotal
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-4 py-3 text-end font-medium text-gray-500"
                  >
                    Total
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-center font-medium text-gray-500"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentData.map((trx, index) => (
                  <TableRow key={trx.id}>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}.
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                      {trx.transactionNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {trx.customer?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {trx.employee?.name || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">
                      Rp{" "}
                      {Number(trx.commissionAmount || 0).toLocaleString(
                        "id-ID",
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {new Date(trx.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      Rp {Number(trx.subtotal).toLocaleString("id-ID")}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                      Rp {Number(trx.total).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          trx.status === "completed"
                            ? "success"
                            : trx.status === "pending"
                              ? "warning"
                              : "error"
                        }
                      >
                        {trx.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => openModal("edit", trx)}
                          disabled={trx.status === "completed"}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="danger"
                          onClick={() => handleDelete(trx.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          <p className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
            Menampilkan {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, transactions.length)} dari{" "}
            {transactions.length} data
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

      {/* Commission Summary Table */}
      {user?.role !== "staff" && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Ringkasan Komisi per Therapist
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start font-medium text-gray-500"
                  >
                    Nama Therapist
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-center font-medium text-gray-500"
                  >
                    Jumlah Transaksi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-end font-medium text-gray-500"
                  >
                    Total Komisi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-end font-medium text-gray-500"
                  >
                    Gaji Per Bulan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-end font-medium text-gray-500"
                  >
                    Total Gaji
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {Object.keys(commissionSummary).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-gray-500"
                    >
                      Belum ada data komisi
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.values(commissionSummary).map((summary, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                        {summary.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-gray-500">
                        {summary.count}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                        Rp {summary.total.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-gray-500">
                        Rp {Number(summary.salary).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                        Rp{" "}
                        {(
                          Number(summary.total) + Number(summary.salary)
                        ).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-h-[90vh] max-w-[800px] overflow-y-auto p-6 lg:p-10"
      >
        <h4 className="text-title-sm mb-7 font-semibold text-gray-800 dark:text-white/90">
          {modalType === "create" ? "Tambah Transaksi" : "Edit Transaksi"}
        </h4>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Pelanggan</Label>
              <Select
                value={formData.customerId}
                options={customers.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Pilih Pelanggan"
                onChange={(val) =>
                  setFormData({ ...formData, customerId: val })
                }
              />
            </div>

            <div>
              <Label>Therapist</Label>
              <Select
                value={formData.employeeId}
                options={employees
                  .filter((e) => {
                    // If editing, the current employee of the transaction must be visible
                    if (modalType === "edit" && e.id === formData.employeeId)
                      return true;
                    // Check if employee is currently busy (status 'pending')
                    const isBusy = transactions.some(
                      (trx) =>
                        trx.employeeId === e.id && trx.status === "pending",
                    );
                    return !isBusy;
                  })
                  .map((e) => ({ value: e.id, label: e.name }))}
                placeholder="Pilih Therapist"
                onChange={(val) =>
                  setFormData({ ...formData, employeeId: val })
                }
              />
            </div>

            <div>
              <Label>Metode Pembayaran</Label>
              <Select
                value={formData.paymentMethod}
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "card", label: "Card" },
                  { value: "transfer", label: "Transfer" },
                ]}
                onChange={(val) =>
                  setFormData({ ...formData, paymentMethod: val })
                }
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                options={[
                  { value: "completed", label: "Completed" },
                  { value: "pending", label: "Pending" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between">
              <Label className="text-lg font-bold">Layanan / Item</Label>
              <Button
                type="button"
                size="xs"
                variant="primary"
                onClick={addItem}
              >
                Add Service
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-end gap-3 rounded-lg border p-3 dark:border-gray-700"
                >
                  <div className="col-span-6">
                    <Label>Layanan</Label>
                    <Select
                      value={item.serviceId.toString()}
                      options={services.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                      placeholder="Pilih Layanan"
                      onChange={(val) =>
                        handleItemChange(index, "serviceId", val)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Harga</Label>
                    <Input
                      value={item.price.toLocaleString("id-ID")}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2 pb-1">
                    <Button
                      type="button"
                      variant="danger"
                      className="w-full"
                      onClick={() => removeItem(index)}
                    >
                      <TrashBinIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 border-t pt-4">
            <div className="text-sm text-gray-500">
              Subtotal: Rp {calculateSubtotal().toLocaleString("id-ID")}
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              Total: Rp {calculateSubtotal().toLocaleString("id-ID")}
            </div>
          </div>

          <div>
            <Label>Catatan</Label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              rows={2}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="mt-8 flex w-full items-center justify-end gap-3">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Simpan Transaksi"}
            </Button>
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

export default TransaksiPage;
