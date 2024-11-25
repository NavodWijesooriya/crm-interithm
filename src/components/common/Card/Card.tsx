import React, { useState, useEffect } from "react";
import { db, auth } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

type Card = {
  id: string;
  customerName?: string;
  companyName?: string;
  email?: string;
  mobileNumber?: string;
  complainCategory?: string;
  description?: string;
  status?: string;
};

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [todoCardData, setTodoCardData] = useState<Card[]>([]);
  const [processingCardData, setProcessingCardData] = useState<Card[]>([]);
  const [doneCardData, setDoneCardData] = useState<Card[]>([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  const fetchData = (
    status: string,
    setState: React.Dispatch<React.SetStateAction<Card[]>>
  ) => {
    const q = query(collection(db, "customer_issues"), where("status", "==", status));
    return onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState(cards);
    });
  };

  useEffect(() => {
    const unsubscribeTodo = fetchData("TODO", setTodoCardData);
    const unsubscribeProcessing = fetchData("processing", setProcessingCardData);
    const unsubscribeDone = fetchData("done", setDoneCardData);

    return () => {
      unsubscribeTodo();
      unsubscribeProcessing();
      unsubscribeDone();
    };
  }, []);

  const openModal = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const handleMove = async (card: Card, status: string) => {
    if (!user) return alert("You must be logged in to perform this action.");
    if (!card.id) return;

    const cardRef = doc(db, "customer_issues", card.id);

    try {
      await updateDoc(cardRef, {
        status,
        [`${status}Time`]: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        [`${status}By`]: user.email,
      });
      alert(`Task moved to ${status}!`);
    } catch (error) {
      console.error(`Error moving task to ${status}:`, error);
      alert(`Error moving task to ${status}.`);
    }
  };

  const renderCard = (
    card: Card,
    actionLabel: string,
    actionHandler: (card: Card) => void
  ) => (
    <div
      key={card.id}
      className="bg-white w-80 h-100 flex flex-col justify-between p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{card.companyName}</h3>
        <p className="text-gray-600 mt-2 line-clamp-4">{card.complainCategory}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <button
          onClick={() => actionHandler(card)}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
        <button
          onClick={() => openModal(card)}
          className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-6">To-Do</h2>
          {todoCardData.map((card) =>
            renderCard(card, "Move", (c) => handleMove(c, "processing"))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Processing</h2>
          {processingCardData.map((card) =>
            renderCard(card, "Move", (c) => handleMove(c, "done"))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Done</h2>
          {doneCardData.map((card) =>
            renderCard(card, "View", openModal)
          )}
        </div>
      </div>

      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{selectedCard.customerName}</h3>
            <p className="text-gray-600 mb-4"><strong>Company Name:</strong> {selectedCard.companyName}</p>
            <p className="text-gray-600 mb-4"><strong>Email:</strong> {selectedCard.email}</p>
            <p className="text-gray-600 mb-4"><strong>Mobile Number:</strong> {selectedCard.mobileNumber}</p>
            <p className="text-gray-600 mb-4"><strong>Category:</strong> {selectedCard.complainCategory}</p>
            <p className="text-gray-600 mb-4"><strong>Description:</strong> {selectedCard.description}</p>
            <button
              onClick={closeModal}
              className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
