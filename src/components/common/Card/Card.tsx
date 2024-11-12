'use client';

import React, { useState } from 'react';

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newCard, setNewCard] = useState({ title: '', content: '', status: 'Todo' });
  const [showForm, setShowForm] = useState(false);

  const [cardData, setCardData] = useState([
    { title: 'Responsive design', content: 'Ensuring users are who they claim to be and making sure everything is smooth for the user experience on both mobile and desktop views.', status: 'Todo' },
    { title: 'User Authentication', content: 'Ensuring users are who they claim to be by implementing strong authentication methods like OTP or OAuth.', status: 'Todo' },
    { title: 'API Integration', content: 'Cards pop-up window.', status: 'Todo' },
  ]);

  const [cardDataProcess, setCardDataProcess] = useState([
    { title: 'Responsive design', content: 'Ensuring users are who they claim to be and making sure everything is smooth for the user experience on both mobile and desktop views.', status: 'Processing' },
    { title: 'User Authentication', content: 'Ensuring users are who they claim to be by implementing strong authentication methods like OTP or OAuth.', status: 'Processing' },
    { title: 'API Integration', content: 'Connecting frontend apps to backend services, ensuring the data flow and security between services.', status: 'Processing' },
  ]);

  const [cardDataFinish, setCardDataFinish] = useState([
    { title: 'Responsive design', content: 'User can’t access mobile version', status: 'Finished' },
    { title: 'User Authentication', content: 'Ensuring users are who they claim to be with OAuth, enhanced security measures implemented.', status: 'Finished' },
    { title: 'API Integration', content: 'Connecting frontend apps to backend services using secure APIs.', status: 'Finished' },
  ]);

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCard.title && newCard.content) {
      setCardData([...cardData, { ...newCard }]);
      setNewCard({ title: '', content: '', status: 'Todo' });
      setShowForm(false);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="container mx-auto p-4">
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-xl font-bold mb-4">Add a New Card</h1>
            <form onSubmit={handleAddCard} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="border border-gray-300 p-2 rounded"
                value={newCard.title}
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Content"
                className="border border-gray-300 p-2 rounded"
                value={newCard.content}
                onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                required
              />
              <select
                className="border border-gray-300 p-2 rounded"
                value={newCard.status}
                onChange={(e) => setNewCard({ ...newCard, status: e.target.value })}
              >
                <option value="Todo">Todo</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-blue-500 text-white px-4 py-2 rounded">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-xl font-bold mb-4">{selectedCard.title}</h2>
            <p>{selectedCard.content}</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[{ title: 'Todo', data: cardData, bgColor: 'bg-blue-500' },
          { title: 'Processing', data: cardDataProcess, bgColor: 'bg-yellow-500' },
          { title: 'Finished', data: cardDataFinish, bgColor: 'bg-green-500' }].map((section, idx) => (
          <div key={idx}>
            <h1 className="text-xl font-bold mb-4">
              {section.title}
              {section.title === 'Todo' && (
                <button
                  className="ml-3 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowForm(true)}
                >
                  <span className="mr-2">+</span>
                </button>
              )}
            </h1>
            <div className="flex flex-wrap gap-4 p-4">
              {section.data.map((card, index) => (
                <div
                  key={index}
                  className="card bg-white shadow-lg text-black w-full sm:w-72 h-80 border border-gray-300 p-6 rounded-lg flex flex-col justify-between"
                >
                  <div className="card-body">
                    <h2 className="card-title text-lg font-semibold">{truncateText(card.title, 20)}</h2>
                    <p className="flex-1 overflow-hidden">{truncateText(card.content, 60)}</p>
                    <div className="card-actions justify-end">
                      <button
                        className={`btn ${section.bgColor} text-white px-4 py-2 rounded`}
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
        ))}
      </div>
    </div>
  );
};

export default Cards;
