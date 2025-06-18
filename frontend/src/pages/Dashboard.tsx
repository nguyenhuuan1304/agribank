import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

const Dashboard = () => {
  const [ipcasFile, setIpcasFile] = useState(null);
  const [customerFile, setCustomerFile] = useState(null);
  const [reportType, setReportType] = useState("unsubmitted");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sorting, setSorting] = useState([]);

  const handleIpcasFileChange = (e) => {
    setIpcasFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const handleCustomerFileChange = (e) => {
    setCustomerFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!ipcasFile) {
      setError("Vui lòng chọn file IPCAS Excel");
      return;
    }
    const formData = new FormData();
    formData.append("file", ipcasFile);
    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );
      setSuccess(response.data.message);
      setError("");
      fetchReport(reportType);
    } catch (err) {
      setError(err.response?.data?.error || "Tải lên thất bại");
      setSuccess("");
    }
  };

  const fetchReport = async (type) => {
    try {
      const response = await axios.get(`http://localhost:5000/report/${type}`);
      setData(response.data);
      setError("");
    } catch (err) {
      setError("Không thể tải báo cáo");
    }
  };

  useEffect(() => {
    fetchReport(reportType);
  }, [reportType]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Trref",
        header: "Mã giao dịch",
        enableSorting: true,
      },
      {
        accessorKey: "Custno",
        header: "Mã khách hàng",
        enableSorting: true,
      },
      {
        accessorKey: "Custnm",
        header: "Tên khách hàng",
        enableSorting: true,
      },
      {
        accessorKey: "Tradate",
        header: "Ngày giao dịch",
        enableSorting: true,
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("vi-VN") : "",
      },
      {
        accessorKey: "Currency",
        header: "Tiền tệ",
        enableSorting: true,
      },
      {
        accessorKey: "Amount",
        header: "Số tiền",
        enableSorting: true,
      },
      {
        accessorKey: "bencust",
        header: "Người thụ hưởng",
        enableSorting: true,
      },
      {
        accessorKey: "contract",
        header: "Hợp đồng ngoại thương",
        enableSorting: true,
      },
      {
        accessorKey: "expectedDate",
        header: "Ngày nhận hàng dự kiến",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("vi-VN") : "N/A",
        enableSorting: true,
      },
      {
        accessorKey: "submissionDate",
        header: "Ngày bổ sung dự kiến",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("vi-VN") : "N/A",
        enableSorting: true,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          Quản lý bổ sung chứng từ - Agribank
        </h1>

        {/* File Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tải lên file Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File IPCAS Excel
                </label>
                <Input
                  type="file"
                  accept=".xlsx"
                  onChange={handleIpcasFileChange}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium

 text-gray-700 mb-1"
                >
                  File thông tin khách hàng
                </label>
                <Input
                  type="file"
                  accept=".xlsx"
                  onChange={handleCustomerFileChange}
                />
              </div>
              <Button
                onClick={handleUpload}
                className="bg-green-600 hover:bg-green-700"
              >
                Tải lên
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Section */}
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo giao dịch</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() => setReportType("unsubmitted")}
                variant={reportType === "unsubmitted" ? "default" : "outline"}
                className={
                  reportType === "unsubmitted"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                Báo cáo chưa bổ sung
              </Button>
              <Button
                onClick={() => setReportType("overdue")}
                variant={reportType === "overdue" ? "default" : "outline"}
                className={
                  reportType === "overdue"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                Báo cáo quá hạn
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer"
                      >
                        {header.column.columnDef.header}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : null}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell)
                          : cell.getValue()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
