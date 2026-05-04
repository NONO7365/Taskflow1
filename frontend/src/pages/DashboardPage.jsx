import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await api.post("/boards", { title: newTitle });
      setBoards([res.data, ...boards]);
      setNewTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBoard = async (id) => {
    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Bonjour, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes tableaux</h2>

        {/* Formulaire création */}
        <form onSubmit={createBoard} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nom du nouveau tableau..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Créer
          </button>
        </form>

        {/* Liste des tableaux */}
        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : boards.length === 0 ? (
          <p className="text-gray-500">
            Aucun tableau pour l'instant. Crée-en un !
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="bg-white rounded-xl shadow p-5 flex justify-between items-start hover:shadow-md transition"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/boards/${board.id}`)}
                >
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {board.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(board.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => deleteBoard(board.id)}
                  className="text-red-400 hover:text-red-600 text-sm ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
