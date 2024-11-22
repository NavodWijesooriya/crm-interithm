"use client";

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

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false); // State for To-Do card modal
  const [selectedCard, setSelectedCard] = useState(null);
  const [todoCardData, setTodoCardData] = useState([]);
  const [processingCardData, setProcessingCardData] = useState([]);
  const [doneCardData, setDoneCardData] = useState([]);
  const [showMoreTodo, setShowMoreTodo] = useState(false);
  const [showMoreProcessing, setShowMoreProcessing] = useState(false);
  const [showMoreDone, setShowMoreDone] = useState(false);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  const fetchData = (status, setState) => {
    const q = query(collection(db, "customer_issues"), where("status", "==", status));
    return onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState(cards);
    });
  };

  useEffect(() => fetchData("TODO", setTodoCardData), []);
  useEffect(() => fetchData("processing", setProcessingCardData), []);
  useEffect(() => fetchData("done", setDoneCardData), []);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const openTodoModal = (card) => {
    setSelectedCard(card);
    setIsTodoModalOpen(true); // Open the To-Do modal
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
    setIsTodoModalOpen(false); // Close To-Do modal as well
  };

  const handleMove = async (card, status) => {
    if (!user) return alert("You must be logged in to perform this action.");
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

  const renderCard = (card, actionLabel, actionHandler, additionalActionLabel, additionalActionHandler) => (
    <div
      key={card.id}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
    >
      <h3 className="text-lg font-semibold text-gray-800">{card.customerName}</h3>
      <p className="text-gray-600 mt-2">{card.description}</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => actionHandler(card)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
        <button
          onClick={() => additionalActionHandler(card)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          {additionalActionLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* To-Do Section */}
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-6">To-Do</h2>
          {todoCardData.slice(0, showMoreTodo ? todoCardData.length : 6).map((card) =>
            renderCard(
              card,
              "=>", // Label for Move button
              (c) => handleMove(c, "processing"), // Move to processing handler
              "View", // Label for View Details button
              (c) => openTodoModal(c) // Open customer details modal
            )
          )}
          <button
            onClick={() => setShowMoreTodo((prev) => !prev)}
            className="mt-4 text-blue-500 font-medium hover:underline"
          >
            {showMoreTodo ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Processing Section */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Processing</h2>
          {processingCardData.slice(0, showMoreProcessing ? processingCardData.length : 6).map((card) =>
            renderCard(card, "=>", (c) => handleMove(c, "done"))
          )}
          <buttonqwe123qqwe
            onClick={() => setShowMoreProcessing((prev) => !prev)}
            className="mt-4 text-blue-500 font-medium hover:underline"
          >
            {showMoreProcessing ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Done Section */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Done</h2>
          {doneCardData.slice(0, showMoreDone ? doneCardData.length : 6).map((card) =>
            renderCard(card, "Details", openModal)
          )}
          <button
            onClick={() => setShowMoreDone((prev) => !prev)}
            className="mt-4 text-blue-500 font-medium hover:underline"
          >
            {showMoreDone ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>

      {/* To-Do Modal */}
      {isTodoModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedCard.customerName}
            </h3>
            <p className="text-gray-600 mb-6">{selectedCard.description}</p>
            <div className="mb-4">
              <label htmlFor="additionalDetails" className="block text-gray-700 font-medium">
                Add Details:
              </label>
              <textarea
                id="additionalDetails"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                placeholder="Enter additional details..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal (for Done cards or others) */}
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-lg w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedCard.customerName}
            </h3>
            <p className="text-gray-600 mb-6">{selectedCard.description}</p>
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
