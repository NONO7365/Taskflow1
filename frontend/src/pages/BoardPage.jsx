import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newCardTitles, setNewCardTitles] = useState({});

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    try {
      await api.post(`/boards/${id}/columns`, { title: newColumnTitle });
      setNewColumnTitle("");
      fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const createCard = async (e, columnId) => {
    e.preventDefault();
    const title = newCardTitles[columnId];
    if (!title?.trim()) return;
    try {
      await api.post(`/boards/columns/${columnId}/cards`, { title });
      setNewCardTitles({ ...newCardTitles, [columnId]: "" });
      fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

  if (!board)
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex items-center gap-4 shadow">
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:bg-blue-700 px-3 py-1 rounded-lg transition text-sm"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold">{board.title}</h1>
      </nav>

      <div className="p-6 flex gap-4 overflow-x-auto">
        {/* Colonnes */}
        {board.columns?.map((column) => (
          <div
            key={column.id}
            className="bg-gray-200 rounded-xl p-4 w-72 flex-shrink-0"
          >
            <h3 className="font-semibold text-gray-700 mb-3">{column.title}</h3>

            {/* Cartes */}
            <div className="space-y-2 mb-3">
              {column.cards?.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg p-3 shadow-sm hover:shadow transition cursor-pointer"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {card.title}
                  </p>
                  {card.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {card.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Formulaire nouvelle carte */}
            <form onSubmit={(e) => createCard(e, column.id)}>
              <input
                type="text"
                value={newCardTitles[column.id] || ""}
                onChange={(e) =>
                  setNewCardTitles({
                    ...newCardTitles,
                    [column.id]: e.target.value,
                  })
                }
                placeholder="+ Ajouter une carte..."
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </form>
          </div>
        ))}

        {/* Formulaire nouvelle colonne */}
        <div className="w-72 flex-shrink-0">
          <form onSubmit={createColumn}>
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="+ Ajouter une colonne..."
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
