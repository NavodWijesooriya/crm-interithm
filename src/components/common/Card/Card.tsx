const Cards = () => {
  const cardData = [
    {
      title: 'Responsive design',
      content: 'If a dog chews shoes whose shoes does he choose?',
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
      content: 'If a dog chews shoes whose shoes does he choose?',
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 p- ml-6"> {/* Adjust for sidebar width */}
      <div className="mb-8 w-full lg:w-1/3">
        <h1 className="text-xl font-bold mb-4">Todo</h1>
        <div className="flex flex-col gap-6"> {/* Increased gap between cards */}
          {cardData.map((card, index) => (
            <div key={index} className="card bg-white shadow-lg text-black-content w-full lg:w-96 border border-gray-300 p-4 rounded-lg">
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{card.title}</h2>
                <p>{card.content}</p>
                <div className="card-actions justify-end">
                  <button
                    className={`btn ${card.status === 'Todo' ? 'bg-blue-500' : 'bg-gray-500'} text-white px-4 py-2 rounded`}
                  >
                    {card.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 w-full lg:w-1/3">
        <h1 className="text-xl font-bold mb-4">Processing</h1>
        <div className="flex flex-col gap-6"> {/* Increased gap between cards */}
          {cardDataProcess.map((card, index) => (
            <div key={index} className="card bg-white shadow-lg text-black-content w-full lg:w-96 border border-gray-300 p-4 rounded-lg">
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{card.title}</h2>
                <p>{card.content}</p>
                <div className="card-actions justify-end">
                  <button
                    className={`btn ${card.status === 'Processing' ? 'bg-yellow-500' : 'bg-gray-500'} text-white px-4 py-2 rounded`}
                  >
                    {card.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 w-full lg:w-1/3 m-2">
        <h1 className="text-xl font-bold mb-4">Finished</h1>
        <div className="flex flex-col gap-6"> {/* Increased gap between cards */}
          {cardDataFinish.map((card, index) => (
            <div key={index} className="card bg-white shadow-lg text-black-content w-full lg:w-96 border border-gray-300 p-4 rounded-lg">
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{card.title}</h2>
                <p>{card.content}</p>
                <div className="card-actions justify-end">
                  <button
                    className={`btn ${card.status === 'Finished' ? 'bg-green-500' : 'bg-gray-500'} text-white px-4 py-2 rounded`}
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
