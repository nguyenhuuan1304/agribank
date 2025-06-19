import { useEffect, useState } from "react";
import { fetchTransactions, uploadTransactionFile } from "../services/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Transaction = {
  id: number;
  transaction_number: string;
  customer_name: string;
  transaction_amount: number;
  currency: string;
  transaction_date: string;
  remark: string;
};

export default function TransactionTable() {
  const [data, setData] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadTransactionFile(file);
      await loadData();
      setDialogOpen(false);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions(page, 10, search);
      setData(res.data);
      setLastPage(res.meta.lastPage);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="overflow-auto max-w-7xl mx-auto p-4 space-y-4">
      <div className="flex justify-between w-full">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
          <Input
            placeholder="Tìm theo tên khách hàng..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button className="w-[200px]" type="submit">
            Tìm kiếm
          </Button>
        </form>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-[200px] !bg-[#F97316] text-white"
              onClick={() => setDialogOpen(true)}
            >
              Upload IPCAS Excel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Upload IPCAS Excel</DialogTitle>
              <DialogDescription className="flex flex-col mt-6 gap-4">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleUpload}
                    className="!bg-[#F97316] text-white"
                  >
                    Tải lên
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4"></div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="min-w-full text-sm border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Transaction</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Currency</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-2">{tx.transaction_number}</td>
                  <td className="p-2">{tx.customer_name}</td>
                  <td className="p-2">{tx.transaction_amount}</td>
                  <td className="p-2">{tx.currency}</td>
                  <td className="p-2">
                    {new Date(tx.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{tx.remark}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    Không có kết quả khách hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination className="mt-4">
            <PaginationContent className="flex gap-2 items-center">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <PaginationPrevious />
                </Button>
              </PaginationItem>
              <span className="text-sm">
                Trang {page} / {lastPage}
              </span>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                >
                  <PaginationNext />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
