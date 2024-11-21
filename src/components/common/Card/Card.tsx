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

      // Update state by removing card from processing and adding it to done
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
    <div>
      {/* To-Do, Processing, and Done Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* To-Do Section */}
        <div>
          <div className="text-2xl font-semibold mt-8 mb-4 text-gray-800 border-b-4 border-blue-500 pb-2 flex items-center justify-between bg-gray-100 px-4 rounded-lg shadow-md">
            <span>To-Do</span>
          </div>

          <div className="grid gap-4">
            {todoCardData.slice(0, showMoreTodo ? todoCardData.length : 4).map((card, index) => (
              <div
                key={`${card.id}-${index}`} // Ensure uniqueness by combining the ID with the index
                className="bg-white p-2 shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="text-sm font-semibold text-blue-600">{card.customerName}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
                <p className="mt-2 text-xs text-gray-500">Status: {card.status}</p>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded transition-all duration-200 transform hover:scale-105"
                    onClick={() => handleAssignAndMoveToProcessing(card)}
                  >
                    Move to Processing
                  </button>
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded transition-all duration-200 transform hover:scale-105"
                    onClick={() => openModal(card)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="text-blue-500 mt-4"
            onClick={() => setShowMoreTodo((prev) => !prev)}
          >
            {showMoreTodo ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Processing Section */}
        <div>
          <div className="text-2xl font-semibold mt-8 mb-4 text-gray-800 border-b-4 border-blue-500 pb-2 flex items-center justify-between bg-gray-100 px-4 rounded-lg shadow-md">
            <span>Processing</span>
          </div>

          <div className="grid gap-4">
            {processingCardData.slice(0, showMoreProcessing ? processingCardData.length : 4).map((card, index) => (
              <div
                key={`${card.id}-${index}`} // Ensure uniqueness by combining the ID with the index
                className="bg-white p-2 shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="text-sm font-semibold text-blue-600">{card.customerName}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
                <p className="mt-2 text-xs text-gray-500">Status: {card.status}</p>
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded mt-4 transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleMoveToDone(card)}
                >
                  Move to Done
                </button>
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded mt-4 transition-all duration-200 transform hover:scale-105"
                  onClick={() => openModal(card)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
          <button
            className="text-blue-500 mt-4"
            onClick={() => setShowMoreProcessing((prev) => !prev)}
          >
            {showMoreProcessing ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Done Section */}
        <div>
          <div className="text-2xl font-semibold mt-8 mb-4 text-gray-800 border-b-4 border-blue-500 pb-2 flex items-center justify-between bg-gray-100 px-4 rounded-lg shadow-md gap-10">
            <span>Done</span>
          </div>

          <div className="grid gap-4">
            {doneCardData.map((card, index) => (
              <div
                key={`${card.id}-${index}`} // Ensure uniqueness by combining the ID with the index
                className="bg-white p-2 shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="text-sm font-semibold text-blue-600">{card.customerName}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
                <p className="mt-2 text-xs text-gray-500">Status: {card.status}</p>
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded mt-4 transition-all duration-200 transform hover:scale-105"
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
        <div className="modal">
          {/* Your modal content goes here */}
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Cards;
