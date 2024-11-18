'use client';

import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'

const Cards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newCard, setNewCard] = useState({ title: '', content: '', status: 'Todo' });
  const [showForm, setShowForm] = useState(false);

  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user')

  console.log({user})

if (!user && !userSession) {
  router.push('/sign-up')
}

  // Card data for Todo, Processing, and Finished
  const [cardData, setCardData] = useState([
    { title: 'Responsive Design', content: 'Improve mobile and desktop UX.', status: 'Todo' },
    { title: 'User Authentication', content: 'Implement secure login.', status: 'Todo' },
    { title: 'API Integration', content: 'Integrate frontend with backend services.', status: 'Todo' },
  ]);

  const [cardDataProcess, setCardDataProcess] = useState([
    { title: 'UI Testing', content: 'Ensure all components are responsive.', status: 'Processing' },
    { title: 'OAuth Implementation', content: 'Set up OAuth for secure login.', status: 'Processing' },
    { title: 'Payment Gateway', content: 'Integrate secure payment APIs.', status: 'Processing' },
  ]);

  const [cardDataFinish, setCardDataFinish] = useState([
    { title: 'Frontend Setup', content: 'React and Tailwind CSS setup completed.', status: 'Finished' },
    { title: 'Unit Tests', content: 'All components tested successfully.', status: 'Finished' },
    { title: 'Deployment', content: 'Project successfully deployed.', status: 'Finished' },
  ]);

  // Modal handlers
  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  // Handle adding a new card
  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCard.title && newCard.content) {
      setCardData([...cardData, { ...newCard }]);
      setNewCard({ title: '', content: '', status: 'Todo' });
      setShowForm(false);
    }
  };

  // const handleSeleteCard = (e) => {
  //   e.preventDefault();
  //   if (newCard.title && newCard.content) {
  //     setCardData([...cardData, { ...newCard }]);
  //     setNewCard({ title: '', content: '', status: 'Todo' });
  //     setShowForm(false);
  //   }
  // };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Responsive card style classes
  const cardStyle = "flex flex-col justify-between p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 h-60"; // Fixed height

  return (
    <div className="container mx-auto p-4">

      <button onClick={() => {
        
        signOut(auth)
        sessionStorage.removeItem('user')}}>Log out</button>
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add a New Card</h2>
            <form onSubmit={handleAddCard} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="p-2 border rounded"
                value={newCard.title}
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Content"
                className="p-2 border rounded"
                value={newCard.content}
                onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                required
              />
              <button type="submit" className="bg-blue-500 text-white py-2 rounded">Add Card</button>
            </form>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedCard.title}</h2>
            <p>{selectedCard.content}</p>
            <button className="mt-4 bg-red-500 text-white py-2 rounded" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[{ title: 'Todo', data: cardData, bgColor: 'bg-blue-500' },
          { title: 'Processing', data: cardDataProcess, bgColor: 'bg-yellow-500' },
          { title: 'Finished', data: cardDataFinish, bgColor: 'bg-green-500' }].map((section, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${section.bgColor} text-white p-2 rounded`}>
                {section.title}
              </h2>
              {section.title === 'Todo' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded "
                >
                  + Add
                </button>
              )}
            </div>

            {/* Card List */}
            {section.data.map((card, index) => (
              <div key={index} className={`${cardStyle} md:max-w-xs`}>
                <h3 className="text-lg font-semibold">{truncateText(card.title, 20)}</h3>
                <p className="text-gray-600 overflow-auto">{truncateText(card.content, 60)}</p>
                <button
                  onClick={() => openModal(card)}
                  className={`${section.bgColor} text-white py-1 px-2 text-sm rounded mt-2 ml-auto`}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
