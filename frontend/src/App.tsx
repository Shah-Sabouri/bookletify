import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";

const FavoritesPage = () => <h2>Favorites Page (Coming Soon)</h2>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/album/:id" element={<AlbumDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
