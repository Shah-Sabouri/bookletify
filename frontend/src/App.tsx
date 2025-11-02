import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import Navbar from "./components/Navbar";
import SearchResultsPage from "./pages/SearchResultsPage";
import RequireAuth from "./components/RequireAuth";
import AdminDashboard from "./pages/AdminDashboard";

const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

function AppContent() {
  useLocation();

  return (
    <>
      {<Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/album/:id" element={<AlbumDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/admin" element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        }/>
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
