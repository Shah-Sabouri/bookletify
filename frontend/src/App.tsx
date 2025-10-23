import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import Navbar from "./components/Navbar";

const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth"; //Navbar hidden on auth page

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/album/:id" element={<AlbumDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
