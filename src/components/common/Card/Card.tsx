"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [todoCardData, setTodoCardData] = useState([]);
  const [processingCardData, setProcessingCardData] = useState([]);
  const [doneCardData, setDoneCardData] = useState([]);
  const [user, loading] = useAuthState(auth);
  const [showMoreTodo, setShowMoreTodo] = useState(false);
  const [showMoreProcessing, setShowMoreProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const q = query(collection(db, "customer_issues"), where("status", "==", "TODO"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodoCardData(cards);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "customer_issues"), where("status", "==", "processing"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProcessingCardData(cards);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "customer_issues"), where("status", "==", "done"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoneCardData(cards);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const handleAssignAndMoveToProcessing = async (card) => {
    if (!user) return alert("You must be logged in to assign the task.");

    const cardRef = doc(db, "customer_issues", card.id);

    try {
      await updateDoc(cardRef, {
        assignedTo: user.email,
        assignedTime: serverTimestamp(),
        status: "processing",
        lastUpdated: serverTimestamp(),
        assignedBy: user.email,
      });

      await addDoc(collection(db, "customer_issues"), {
        issueId: card.id,
        companyName: card.companyName,
        complainCategory: card.complainCategory,
        customerName: card.customerName,
        description: card.description,
        email: card.email,
        assignedBy: user.email,
        assignedAt: serverTimestamp(),
        assignedUserDetails: {
          uid: user.uid,
        },
      });

      alert("Task has been assigned and moved to processing!");
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("There was an error assigning and moving the task to processing.");
    }
  };

  const handleMoveToDone = async (card) => {
    if (!user) return alert("You must be logged in to move the task to done.");

    const cardRef = doc(db, "customer_issues", card.id);

    try {
      await updateDoc(cardRef, {
        status: "done",
        doneTime: serverTimestamp(),
        doneBy: user.email,
        doneUserDetails: {
          uid: user.uid,
        },
        lastUpdated: serverTimestamp(),
      });

      setProcessingCardData((prevData) =>
        prevData.filter((item) => item.id !== card.id)
      );
      setDoneCardData((prevData) => [...prevData, card]);

      alert("Task has been moved to Done!");
    } catch (error) {
      console.error("Error moving task to Done:", error);
      alert("There was an error moving the task to Done.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* To-Do Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">To-Do</h2>
          <div className="space-y-4">
            {todoCardData.slice(0, showMoreTodo ? todoCardData.length : 6).map((card) => (
              <div
                key={card.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-gray-800">{card.customerName}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {card.status}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleAssignAndMoveToProcessing(card)}
                  >
                    Move to Processing
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal(card)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="text-blue-500 underline"
            onClick={() => setShowMoreTodo((prev) => !prev)}
          >
            {showMoreTodo ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Processing Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">Processing</h2>
          <div className="space-y-4">
            {processingCardData.slice(0, showMoreProcessing ? processingCardData.length : 6).map((card) => (
              <div
                key={card.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-gray-800">{card.customerName}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {card.status}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleMoveToDone(card)}
                  >
                    Move to Done
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal(card)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="text-blue-500 underline"
            onClick={() => setShowMoreProcessing((prev) => !prev)}
          >
            {showMoreProcessing ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Done Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">Done</h2>
          <div className="space-y-4">
            {doneCardData.map((card) => (
              <div
                key={card.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-gray-800">{card.customerName}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {card.status}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  onClick={() => openModal(card)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">{selectedCard.customerName}</h3>
            <p className="mt-2">{selectedCard.description}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
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
