import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import DokumenAdmin from './pages/admin/DokumenAdmin';
import UserAdmin from './pages/admin/UserAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Route - Pakai UserLayout (simple) */}
        <Route path="/chatbot" element={
          <UserLayout>
            <Chatbot />
          </UserLayout>
        } />
        
        {/* Admin Routes - Pakai AdminLayout (dengan navbar) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DokumenAdmin />} />
          <Route path="dokumen" element={<DokumenAdmin />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="admin" element={<UserAdmin />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}