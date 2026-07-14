import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ServicesPage from "./pages/services/ServicesPage";
import ServiceDetailsPage from "./pages/services/ServiceDetailsPage";
import DevelopmentDetailsPage from "./pages/Development/DevelopmentDetailsPage";
import DevelopmentsPage from "./pages/Development/DevelopmentsPage";
import Company from "./pages/Company";
import Blogs from "./pages/Blog/Blogs";
import BlogDetails from "./pages/Blog/BlogDetails";
import AuthorBlogs from "./pages/Blog/AuthorBlogs";
import { Outlet } from "react-router-dom";
import Address from "./pages/Address";
import DataProtection from "./pages/DataProtection";
import Contact from "./pages/Contact";
import ViewArticle from "./pages/Article/ViewArticle";
import CreateArticle from "./pages/Article/CreateArticle";
import EditArticle from "./pages/Article/EditArticle";
import NotFound from "./pages/NotFound";

function ContainerLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route element={<ContainerLayout />}>
            {/* <Route path="/" element={<ViewArticle />} /> */}
            {/* <Route path="/ce" element={<CreateArticle />} />
            <Route path="/edit/:id" element={<EditArticle />} /> */}

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/en" element={<Home />} />
            <Route path="/en/home" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/en/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailsPage />} />
            <Route path="/en/services/:slug" element={<ServiceDetailsPage />} />
            <Route path="/:slug" element={<ServiceDetailsPage />} />
            <Route path="/en/:slug" element={<ServiceDetailsPage />} />
            <Route path="/developments" element={<DevelopmentsPage />} />
            <Route path="/en/developments" element={<DevelopmentsPage />} />
            <Route path="/developments/:slug" element={<DevelopmentDetailsPage />} />
            <Route path="/en/developments/:slug" element={<DevelopmentDetailsPage />} />
            <Route path="/company" element={<Company />} />
            <Route path="/en/company" element={<Company />} />
            <Route path="/imprint" element={<Address />} />
            <Route path="/en/imprint" element={<Address />} />
            <Route path="/address" element={<Address />} />
            <Route path="/en/address" element={<Address />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/en/data-protection" element={<DataProtection />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/en/contact" element={<Contact />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/en/blogs" element={<Blogs />} />
            <Route path="/author/:username" element={<AuthorBlogs />} />
            <Route path="/en/author/:username" element={<AuthorBlogs />} />
          </Route>

          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/en/blogs/:id" element={<BlogDetails />} />

          {/* Explicit 400, 403, and 404 routes */}
          <Route path="/400" element={<Navigate to="/404" replace />} />
          <Route path="/403" element={<Navigate to="/404" replace />} />
          <Route path="/en/400" element={<Navigate to="/en/404" replace />} />
          <Route path="/en/403" element={<Navigate to="/en/404" replace />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/en/404" element={<NotFound />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
