export default function CalculatePage() {

  const tableData = [
    { user: 'John Doe', email: 'john@example.com', processingTime: '2 hours', pay: '$100' },
    { user: 'Jane Smith', email: 'jane@example.com', processingTime: '3 hours', pay: '$150' },
    { user: 'Bob Johnson', email: 'bob@example.com', processingTime: '1.5 hours', pay: '$80' },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Calculate</h1>
      <table className="table-auto w-3/4 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300 text-base">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-8 py-4 text-left text-gray-800 font-medium">User</th>
            <th className="px-8 py-4 text-left text-gray-800 font-medium">Email</th>
            <th className="px-8 py-4 text-left text-gray-800 font-medium">Processing Time</th>
            <th className="px-8 py-4 text-left text-gray-800 font-medium">Pay</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
            >
              <td className="px-8 py-4 text-gray-900">{row.user}</td>
              <td className="px-8 py-4 text-gray-700">{row.email}</td>
              <td className="px-8 py-4 text-gray-700">{row.processingTime}</td>
              <td className="px-8 py-4 text-gray-700">{row.pay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
