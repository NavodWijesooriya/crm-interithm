import React, { useState, useEffect } from "react";
// import { z } from "zod";
import { serverTimestamp, updateDoc, doc, query, where, onSnapshot, collection, Timestamp } from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";
import { format } from "date-fns";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

// const zodSchema = z.object({
//   customerName: z.string().min(2, { message: "Customer name must be at least 2 characters." }),
//   companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
//   email: z.string().email({ message: "Please enter a valid email address." }),
//   phoneNumber: z.string().regex(/^\+?[0-9]{1,14}$/, { message: "Enter a valid phone number." }),
//   complainCategory: z.string().min(1, { message: "Complain category is required." }),
//   description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
// });

type Status = "TODO" | "processing" | "done"; // Restrict status to specific values

interface Card {
  id: string;
  customerName?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  complainCategory?: string;
  description?: string;
  status?: Status;
  createdAt?: Timestamp;
  todoTime?: Timestamp;
  processingTime?: Timestamp;
  doneTime?: Timestamp;
}

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [todoCardData, setTodoCardData] = useState<Card[]>([]);
  const [processingCardData, setProcessingCardData] = useState<Card[]>([]);
  const [doneCardData, setDoneCardData] = useState<Card[]>([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [showMoreTodo, setShowMoreTodo] = useState(false);
  const [showMoreProcessing, setShowMoreProcessing] = useState(false);
  const [showMoreDone, setShowMoreDone] = useState(false);

  useEffect(() => {
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  const fetchData = (status: Status, setState: React.Dispatch<React.SetStateAction<Card[]>>) => {
    const q = query(collection(db, "customer_issues"), where("status", "==", status));

    return onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Card[];
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

  const handleMove = async (card: Card, status: Status) => {
    if (!user) {
      alert("You must be logged in to perform this action.");
      return;
    }
    if (!card.id) {
      alert("Card ID is missing.");
      return;
    }

    // Confirmation before moving to processing or done
    if (status === "processing") {
      const confirmAssign = window.confirm("Are you sure you want to assign this task for processing?");
      if (!confirmAssign) return;
    }

    if (status === "done") {
      const confirmCompletion = window.confirm("Are you sure this task is completed?");
      if (!confirmCompletion) return;

      // Additional validation: Ensure processingTime is set before marking as done
      if (!card.processingTime) {
        alert("This task cannot be marked as done because it was never assigned.");
        return;
      }
    }

    const cardRef = doc(db, "customer_issues", card.id);

    try {
      const updateData: { [key: string]: } = {
        status,
        lastUpdated: serverTimestamp() as Timestamp, // Use Timestamp for serverTimestamp()
        [`${status}By`]: user.email,
      };

      if (status === "TODO") {
        updateData.todoTime = serverTimestamp() as Timestamp;
      } else if (status === "processing") {
        updateData.processingTime = serverTimestamp() as Timestamp;
      } else if (status === "done") {
        updateData.doneTime = serverTimestamp() as Timestamp; // Mark completion time
      }

      await updateDoc(cardRef, updateData);
      alert(`Task successfully moved to ${status}!`);
    } catch (error) {
      console.error(`Error moving task to ${status}:`, error);
      alert(`Error moving task to ${status}.`);
    }
  };

  const safeFormatDate = (date: Timestamp | undefined) => {
    try {
      return date ? format(date.toDate(), "Ppp") : "N/A";
    } catch {
      return "N/A";
    }
  };

  const renderCard = (card: Card, actionLabel: string, actionHandler: (card: Card) => void) => {
    const createdAtFormatted = safeFormatDate(card.createdAt);
    const todoTimeFormatted = safeFormatDate(card.todoTime);
    const processingTimeFormatted = safeFormatDate(card.processingTime);
    const doneTimeFormatted = safeFormatDate(card.doneTime);

    return (
      <div
        key={card.id}
        className="bg-white w-80 h-100 flex flex-col justify-between p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-100 mb-8 border border-gray-300"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{card.companyName}</h3>
          <p className="text-gray-600 mt-2 line-clamp-4">{card.complainCategory}</p>
          <p className="text-sm text-gray-500 mt-1">Created At: {createdAtFormatted}</p>
          {card.status === "processing" && <p className="text-sm text-gray-500 mt-1">Assigned At: {processingTimeFormatted}</p>}
          {card.status === "TODO" && <p className="text-sm text-gray-500 mt-1">Added To To-Do At: {todoTimeFormatted}</p>}
          {card.status === "done" && <p className="text-sm text-gray-500 mt-1">Completed At: {doneTimeFormatted}</p>}
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
  };

  const todoCardsToDisplay = showMoreTodo ? todoCardData : todoCardData.slice(0, 3);
  const processingCardsToDisplay = showMoreProcessing ? processingCardData : processingCardData.slice(0, 3);
  const doneCardsToDisplay = showMoreDone ? doneCardData : doneCardData.slice(0, 3);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-8">
        <div className="border border-gray-300 rounded-lg p-12 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">To-Do</h2>
          {todoCardsToDisplay.map((card) =>
            renderCard(card, "Assign", (c) => handleMove(c, "processing"))
          )}
          {todoCardData.length > 4 && (
            <button
              onClick={() => setShowMoreTodo(!showMoreTodo)}
              className="text-blue-600 mt-4"
            >
              {showMoreTodo ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        <div className="border border-gray-300 rounded-lg p-12 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Processing</h2>
          {processingCardsToDisplay.map((card) =>
            renderCard(card, "Done", (c) => handleMove(c, "done"))
          )}
          {processingCardData.length > 4 && (
            <button
              onClick={() => setShowMoreProcessing(!showMoreProcessing)}
              className="text-blue-600 mt-4"
            >
              {showMoreProcessing ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        <div className="border border-gray-300 rounded-lg p-12 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Done</h2>
          {doneCardsToDisplay.map((card) =>
            renderCard(card, "Reopen", (c) => handleMove(c, "TODO"))
          )}
          {doneCardData.length > 4 && (
            <button
              onClick={() => setShowMoreDone(!showMoreDone)}
              className="text-blue-600 mt-4"
            >
              {showMoreDone ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-xl">
            <h2 className="text-xl font-semibold text-gray-800">{selectedCard.companyName}</h2>
            <div className="mt-4">
              <p className="text-gray-700">Customer Name: {selectedCard.customerName}</p>
              <p className="text-gray-700">Email: {selectedCard.email}</p>
              <p className="text-gray-700">Phone Number: {selectedCard.phoneNumber}</p>
              <p className="text-gray-700">Category: {selectedCard.complainCategory}</p>
              <p className="text-gray-700">Description: {selectedCard.description}</p>
              <p className="text-gray-700">Status: {selectedCard.status}</p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
