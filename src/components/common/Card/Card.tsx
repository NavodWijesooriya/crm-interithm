'use client'

import React, { useState } from 'react';

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const cardData = [
    {
      title: 'Responsive design',
      content: 'Ensuring users are who they claim to be.',
      status: 'Todo',
    },
    {
      title: 'User Authentication',
      content: 'Ensuring users are who they claim to be.',
      status: 'Todo',
    },
    {
      title: 'API Integration',
      content: 'Connecting frontend apps to backend services.',
      status: 'Todo',
    },
  ];

  const cardDataProcess = [
    {
      title: 'Responsive design',
      content: 'Ensuring users are who they claim to be.',
      status: 'Processing',
    },
    {
      title: 'User Authentication',
      content: 'Ensuring users are who they claim to be.',
      status: 'Processing',
    },
    {
      title: 'API Integration',
      content: 'Connecting frontend apps to backend services.',
      status: 'Processing',
    },
  ];

  const cardDataFinish = [
    {
      title: 'Responsive design',
      content: 'User cant access mobile version',
      status: 'Finished',
    },
    {
      title: 'User Authentication',
      content: 'Ensuring users are who they claim to be.',
      status: 'Finished',
    },
    {
      title: 'API Integration',
      content: 'Connecting frontend apps to backend services.',
      status: 'Finished',
    },
  ];

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 ml-20 m-10 ">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedCard.title}</h2>
            <p>{selectedCard.content}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Todo Cards */}
      <div className="mb-8 w-full lg:w-1/3">
        <h1 className="text-xl font-bold mb-4">Todo</h1>
        <div className="flex flex-col gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="card bg-white shadow-lg text-black-content w-full lg:w-96 border border-gray-300 p-4 rounded-lg h-48"
            >
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{card.title}</h2>
                <p>{card.content}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal(card)}
                  >
                    {card.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Cards */}
      <div className="mb-8 w-full lg:w-1/3">
        <h1 className="text-xl font-bold mb-4">Processing</h1>
        <div className="flex flex-col gap-6">
          {cardDataProcess.map((card, index) => (
            <div
              key={index}
              className="card bg-white shadow-lg text-black-content w-full lg:w-96 border border-gray-300 p-4 rounded-lg h-48"
            >
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{card.title}</h2>
                <p>{card.content}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn bg-yellow-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal(card)}
                  >
                    {card.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finished Cards */}
      <div className="mb-8 w-full lg:w-1/3">
        <h1 className="text-xl font-bold mb-4">Finished</h1>
        <div className="flex flex-col gap-6">
          {cardDataFinish.map((card, index) => (
            <div
              key={index}
              className="card bg-white shadow-lg text-black-content w-full lg:w-96 border border-gray-300 p-4 rounded-lg h-48"
            >
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{card.title}</h2>
                <p>{card.content}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => openModal(card)}
                  >
                    {card.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;
