import React, { useState, useEffect } from "react";
import { serverTimestamp, updateDoc, doc, query, where, onSnapshot, collection, Timestamp } from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";
import { format } from "date-fns";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

type Status = "TODO" | "processing" | "done"; 

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
  const [todoCardData, setTodoCardData] = useState<Card[]>([]);
  const [processingCardData, setProcessingCardData] = useState<Card[]>([]);
  const [doneCardData, setDoneCardData] = useState<Card[]>([]);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [showMoreTodo, setShowMoreTodo] = useState(false);
  const [showMoreProcessing, setShowMoreProcessing] = useState(false);
  const [showMoreDone, setShowMoreDone] = useState(false);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

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

  const handleMove = async (card: Card, status: Status) => {
    if (!user) {
      alert("You must be logged in to perform this action.");
      return;
    }
    if (!card.id) {
      alert("Card ID is missing.");
      return;
    }

    if (status === "processing") {
      const confirmAssign = window.confirm("Are you sure you want to assign this task for processing?");
      if (!confirmAssign) return;
    }

    if (status === "done") {
      const confirmCompletion = window.confirm("Are you sure this task is completed?");
      if (!confirmCompletion) return;

      if (!card.processingTime) {
        alert("This task cannot be marked as done because it was never assigned.");
        return;
      }
    }

    const cardRef = doc(db, "customer_issues", card.id);

    try {
      const updateData: { [key: string]: string | Timestamp | undefined | null } = {
        status,
        lastUpdated: serverTimestamp() as Timestamp,
        [`${status}By`]: user.email,
      };

      if (status === "TODO") {
        updateData.todoTime = serverTimestamp() as Timestamp;
      } else if (status === "processing") {
        updateData.processingTime = serverTimestamp() as Timestamp;
      } else if (status === "done") {
        updateData.doneTime = serverTimestamp() as Timestamp;
      }

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === null) {
          updateData[key] = undefined;
        }
      });

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
            className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-500 transition"
          >
            {actionLabel}
          </button>
          <button
            onClick={() => setSelectedCard(card)}
            className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-500 transition"
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
        {/* To-Do Section */}
        <div className="border border-gray-300 rounded-lg p-12 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-500 mb-6">To-Do</h2>
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

        {/* Processing Section */}
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

        {/* Done Section */}
        <div className="border border-gray-300 rounded-lg p-12 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Done</h2>
          {doneCardsToDisplay.map((card) => (
            <div
              key={card.id}
              className="bg-white w-80 h-100 flex flex-col justify-between p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-100 mb-8 border border-gray-300"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{card.companyName}</h3>
                <p className="text-gray-600 mt-2 line-clamp-4">{card.complainCategory}</p>
                <p className="text-sm text-gray-500 mt-1">Created At: {safeFormatDate(card.createdAt)}</p>
                {card.status === "done" && (
                  <p className="text-sm text-gray-500 mt-1">Completed At: {safeFormatDate(card.doneTime)}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg cursor-not-allowed"
                  disabled
                >
                  Completed
                </button>
                <button
                  onClick={() => setSelectedCard(card)}
                  className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-500 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
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

      {/* Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">{selectedCard.companyName}</h3>
            <p><strong>Customer Name:</strong> {selectedCard.customerName}</p>
            <p><strong>Email:</strong> {selectedCard.email}</p>
            <p><strong>Phone Number:</strong> {selectedCard.phoneNumber}</p>
            <p><strong>Description:</strong> {selectedCard.description}</p>
            <p><strong>Category:</strong> {selectedCard.complainCategory}</p>
            <p><strong>Created At:</strong> {safeFormatDate(selectedCard.createdAt)}</p>
            <div className="mt-4">
              <button
                onClick={() => setSelectedCard(null)}
                className="bg-red-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-red-700"
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
