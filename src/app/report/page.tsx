'use client'

import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { format } from "date-fns";

interface Card {
  id: string;
  customerName?: string;
  companyName?: string;
  complainCategory?: string;
  status?: string;
  createdAt?: Timestamp; // Use Firestore Timestamp type
  processingTime?: Timestamp; // Use Firestore Timestamp type
  doneTime?: Timestamp; // Use Firestore Timestamp type
  processingBy?: string;
  doneBy?: string;
}

const Table = () => {
  const [cardData, setCardData] = useState<Card[]>([]);

  useEffect(() => {
    const q = query(collection(db, "customer_issues"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Card[];
      setCardData(data);
    });

    return () => unsubscribe();
  }, []);

  const safeFormatDate = (timestamp: Timestamp | undefined) => {
    try {
      return timestamp ? format(timestamp.toDate(), "Ppp") : "N/A";
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center tracking-wide leading-tight py-4 px-6 bg-gray-100 rounded-lg shadow-lg font-roboto">
        Report
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Customer Name</th>
              <th className="px-6 py-3 text-left">Company Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Processing Time</th>
              <th className="px-6 py-3 text-left">Processing By</th>
              <th className="px-6 py-3 text-left">Done Time</th>
              <th className="px-6 py-3 text-left">Done By</th>
            </tr>
          </thead>
          <tbody>
            {cardData.map((card, index) => (
              <tr
                key={card.id}
                className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all`}
              >
                <td className="px-6 py-4">{card.customerName || "N/A"}</td>
                <td className="px-6 py-4">{card.companyName || "N/A"}</td>
                <td className="px-6 py-4">{card.complainCategory || "N/A"}</td>
                <td className="px-6 py-4">{card.status || "N/A"}</td>
                <td className="px-6 py-4">{safeFormatDate(card.createdAt)}</td>
                <td className="px-6 py-4">{safeFormatDate(card.processingTime)}</td>
                <td className="px-6 py-4">{card.processingBy || "N/A"}</td>
                <td className="px-6 py-4">{safeFormatDate(card.doneTime)}</td>
                <td className="px-6 py-4">{card.doneBy || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
