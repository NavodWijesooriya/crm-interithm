'use client'

import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config"; 
import { collection, getDocs } from "firebase/firestore";

const CalculatePage = () => {
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customer_issues"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTableData(data);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

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
              <td className="px-8 py-4 text-gray-900">{row.customerName || "N/A"}</td>
              <td className="px-8 py-4 text-gray-700">{row.email || "N/A"}</td>
              <td className="px-8 py-4 text-gray-700">{row.processingTime || "N/A"}</td>
              <td className="px-8 py-4 text-gray-700">{row.pay || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalculatePage;
