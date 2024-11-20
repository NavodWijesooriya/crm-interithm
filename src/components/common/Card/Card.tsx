"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import { collection, query, onSnapshot, addDoc, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
// import { any } from "zod";

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [newCard, setNewCard] = useState({
    customerName: "",
    companyName: "",
    email: "",
    complainCategory: "",
    description: "",
    // todo:""
  }); 
  const router = useRouter();

  const [user, loading] = useAuthState(auth);

  if (user) {
    console.log("User logged in:", user); // This contains user data
  } else {
    console.log("User not logged in");
  }

  useEffect(() => {
    if (!loading && !user && !sessionStorage.getItem("user")) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const q = query(collection(db, "customer_issues"),);    
    
    // where("status" , "==" , "TODO"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCardData(cards);
    });

    return () => unsubscribe();
  }, []);


  const openModal = (card:any) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);


  const handleAddCard = async () => {
    try {
      await addDoc(collection(db, "customer_issues"), newCard);
      setNewCard({
        customerName: "",
        companyName: "",
        email: "",
        complainCategory: "",
        description: "",
        // todo:"",
      });
      closeAddModal();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };



  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const cardStyle =
    "flex flex-col justify-between p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 h-40 m-0";

  return (

    <div className="container mx-auto p-4">



<h1 className="text-3xl font-bold text-left text-blue-600 my-4 align-top">
  To do
</h1>

     
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedCard.customerName}</h2>
            <p>
              <strong>Company:</strong> {selectedCard.companyName}
            </p>
            <p>
              <strong>Email:</strong> {selectedCard.email}
            </p>
            <p>
              <strong>Category:</strong> {selectedCard.complainCategory}
            </p>
            <p>
              <strong>Description:</strong> {selectedCard.description}
            </p>

            {/* <p>
              <strong>Description:</strong> {selectedCard.description}
            </p> */}

            {/* <p>
              <strong>Todo:</strong> {selectedCard.todo}
            </p> */}


            <button
              className="mt-4 bg-red-500 text-white py-2 px-5 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Card</h2>
            <form>
              <input
                type="text"
                placeholder="Customer Name"
                value={newCard.customerName}
                onChange={(e) =>
                  setNewCard({ ...newCard, customerName: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={newCard.companyName}
                onChange={(e) =>
                  setNewCard({ ...newCard, companyName: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCard.email}
                onChange={(e) =>
                  setNewCard({ ...newCard, email: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Complain Category"
                value={newCard.complainCategory}
                onChange={(e) =>
                  setNewCard({ ...newCard, complainCategory: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={newCard.description}
                onChange={(e) =>
                  setNewCard({ ...newCard, description: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded"
              /> 


               {/* <textarea
                placeholder="Todo"
                value={newCard.todo}
                onChange={(e) =>
                  setNewCard({ ...newCard, todo: e.target.value })
                }
                className="w-full border p-2 mb-2 rounded"
              /> 
 */}

            </form>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white py-2 px-5 rounded"
                onClick={closeAddModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-5 rounded"
                onClick={handleAddCard}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-start">
        <button
          onClick={openAddModal}
          className="bg-black text-white py-2 px-4 rounded"
        >
          +
        </button>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardData.map((card) => (
          <div key={card.id} className={`${cardStyle} md:max-w-xs`}>
            <h3 className="text-lg font-semibold">{truncateText(card.customerName, 20)}</h3>
            <p className="text-gray-600 overflow-auto">
              {truncateText(card.description, 60)}
            </p>
            <button
              onClick={() => openModal(card)}
              className="bg-blue-500 text-white py-1 px-2 text-sm rounded mt-2 ml-auto"
            >
              View
            </button>


            
            <button
              
              className="bg-blue-500 text-white py-1 px-2 text-sm rounded mt-2 ml-auto"
            >
              Asign
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
