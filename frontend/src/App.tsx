import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlbumDetailPage from "./pages/AlbumDetailPage";

const LoginPage = () => <h2>Login Page (Coming Soon)</h2>;
const RegisterPage = () => <h2>Register Page (Coming Soon)</h2>;
const FavoritesPage = () => <h2>Favorites Page (Coming Soon)</h2>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/album/:id" element={<AlbumDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
