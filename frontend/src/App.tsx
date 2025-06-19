// import Dashboard from "./pages/Dashboard";
import Header from "./pages/Header";
import TransactionTable from "./pages/TransactionTable";
import UploadForm from "./pages/UploadForm";

function App() {
  return (
    // <>
    //   <Dashboard />
    // </>
    <div className="bg-gray-50 min-h-screen w-screen">
      <Header />
      <UploadForm />
      <TransactionTable />
    </div>
  );
}

export default App;
