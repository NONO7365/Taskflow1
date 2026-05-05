import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/axios";

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newCardTitles, setNewCardTitles] = useState({});
  const [editingCard, setEditingCard] = useState(null);

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

  const deleteCard = async (cardId) => {
    try {
      await api.delete(`/boards/cards/${cardId}`);
      fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

 const deleteColumn = async (columnId) => {
   try {
     await api.delete(`/boards/columns/${columnId}`);
     fetchBoard();
   } catch (err) {
     console.error(err);
   }
 };

  const updateCard = async (cardId, title, description) => {
    try {
      await api.put(`/boards/cards/${cardId}`, { title, description });
      setEditingCard(null);
      fetchBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Mise à jour optimiste de l'UI
    const newBoard = { ...board };
    const sourceCol = newBoard.columns.find(
      (c) => c.id === parseInt(source.droppableId),
    );
    const destCol = newBoard.columns.find(
      (c) => c.id === parseInt(destination.droppableId),
    );
    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    destCol.cards = destCol.cards || [];
    destCol.cards.splice(destination.index, 0, movedCard);
    setBoard(newBoard);

    // Mise à jour en base de données
    try {
      await api.patch(`/boards/cards/${draggableId}/move`, {
        columnId: parseInt(destination.droppableId),
        position: destination.index,
      });
    } catch (err) {
      fetchBoard(); // Annule si erreur
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
          className="hover:bg-blue-700 px-3 py-1.5 rounded-lg transition text-sm font-medium"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold">{board.title}</h1>
      </nav>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="p-6 flex gap-4 overflow-x-auto min-h-screen">
          {board.columns?.map((column) => (
            <div
              key={column.id}
              className="bg-gray-200 rounded-xl p-4 w-72 flex-shrink-0 h-fit"
            >
              {/* Header colonne */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">{column.title}</h3>
                <button
                  onClick={() => deleteColumn(column.id)}
                  className="text-gray-400 hover:text-red-500 text-xs transition"
                >
                  ✕
                </button>
              </div>

              {/* Cartes avec Drag & Drop */}
              <Droppable droppableId={String(column.id)}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-8 rounded-lg transition ${
                      snapshot.isDraggingOver ? "bg-blue-100" : ""
                    }`}
                  >
                    {column.cards?.map((card, index) => (
                      <Draggable
                        key={String(card.id)}
                        draggableId={String(card.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-lg p-3 shadow-sm transition ${
                              snapshot.isDragging
                                ? "shadow-lg rotate-1"
                                : "hover:shadow"
                            }`}
                          >
                            {editingCard?.id === card.id ? (
                              // Mode édition
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingCard.title}
                                  onChange={(e) =>
                                    setEditingCard({
                                      ...editingCard,
                                      title: e.target.value,
                                    })
                                  }
                                  className="w-full text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <textarea
                                  value={editingCard.description || ""}
                                  onChange={(e) =>
                                    setEditingCard({
                                      ...editingCard,
                                      description: e.target.value,
                                    })
                                  }
                                  spellCheck={false}
                                  placeholder="Description..."
                                  className="w-full text-xs border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateCard(
                                        card.id,
                                        editingCard.title,
                                        editingCard.description,
                                      )
                                    }
                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                  >
                                    Sauvegarder
                                  </button>
                                  <button
                                    onClick={() => setEditingCard(null)}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Mode affichage
                              <div>
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium text-gray-800 flex-1">
                                    {card.title}
                                  </p>
                                  <div className="flex gap-1 ml-2">
                                    <button
                                      onClick={() => setEditingCard(card)}
                                      className="text-gray-300 hover:text-blue-500 text-xs transition"
                                    >
                                      ✎
                                    </button>
                                    <button
                                      onClick={() => deleteCard(card.id)}
                                      className="text-gray-300 hover:text-red-500 text-xs transition"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                                {card.description && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {card.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Formulaire nouvelle carte */}
              <form onSubmit={(e) => createCard(e, column.id)} className="mt-3">
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
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
      </DragDropContext>
    </div>
  );
}
