import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import { Home, About, Services, Contact } from "./pages/Public";
import Menu from "./pages/Menu";
import { Login, Register, ForgotPassword } from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CustomerLayout, Dashboard, Profile, Orders } from "./pages/Customer";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import ManageUsers from "./admin/ManageUsers";
import ManageCategories from "./admin/ManageCategories";
import ManageServices from "./admin/ManageServices";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<CustomerLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/orders" element={<CustomerLayout />}>
            <Route index element={<Orders />} />
          </Route>
          <Route path="/profile" element={<CustomerLayout />}>
            <Route index element={<Profile />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* ✅ This is the important line */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/admin/*" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="services" element={<ManageServices />} />
              </Route>
            </Route>

            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
