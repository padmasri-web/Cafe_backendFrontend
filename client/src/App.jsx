import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import MenuManagement from "./pages/MenuManagement";
import TableManagement from "./pages/TableManagement";
import MenuPage from "./pages/MenuPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/demo" replace />} />
        
        {/* Admin Routes */}
        <Route path="/admin/:adminId" element={<AdminDashboard />}>
          <Route index element={<Navigate to="menu" replace />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="tables" element={<TableManagement />} />
        </Route>

        {/* Public Menu Route */}
        <Route path="/menu/:restoId/:tableToken" element={<MenuPage />} />
        <Route path="/order/:restoId/:tableToken" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;