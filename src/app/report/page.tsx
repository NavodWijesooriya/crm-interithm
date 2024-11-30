'use client';

import React, { useState, useEffect } from "react";
import { query, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { format } from "date-fns";

interface Task {
  id: string;
  customerName?: string;
  companyName?: string;
  complainCategory?: string;
  processingBy?: string;
  doneBy?: string;
  processingTime?: { seconds: number; nanoseconds: number };
  doneTime?: { seconds: number; nanoseconds: number };
}

const DoneTasksByUser = () => {
  const [groupedDoneData, setGroupedDoneData] = useState<{
    [email: string]: Task[];
  }>({});

  const formatTimestamp = (timestamp?: { seconds: number; nanoseconds: number }): string => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp.seconds * 1000);
      return format(date, "Pp"); // Example: 11/28/2024, 10:00 AM
    } catch {
      return "Invalid Date";
    }
  };

  useEffect(() => {
    const q = query(collection(db, "customer_issues"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      // Group only 'done' tasks by the 'doneBy' user
      const groupedDone = tasks.reduce((acc, task) => {
        if (task.doneBy) {
          const user = task.doneBy || "Unknown User";
          if (!acc[user]) {
            acc[user] = [];
          }
          acc[user].push(task);
        }
        return acc;
      }, {} as { [email: string]: Task[] });

      setGroupedDoneData(groupedDone);
    });

    return () => unsubscribe();
  }, []);

  const renderTasks = (tasks: Task[]) => {
    return (
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-4">
          <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Customer Name</th>
            <th className="py-3 px-6 text-left">Processing Time</th>
            <th className="py-3 px-6 text-left">Processing By</th>
            <th className="py-3 px-6 text-left">Done By</th>
            <th className="py-3 px-6 text-left">Customer Issue</th>
            <th className="py-3 px-6 text-left">Company Name</th>
          </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
          {tasks.map((task) => (
              <tr
                  key={task.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{(task.customerName)}</td>
                <td className="py-3 px-6 text-left">{formatTimestamp(task.processingTime)}</td>
                <td className="py-3 px-6 text-left">{task.processingBy || "N/A"}</td>
                <td className="py-3 px-6 text-left">{task.doneBy || "N/A"}</td>
                <td className="py-3 px-6 text-left">{task.complainCategory || "N/A"}</td>
                <td className="py-3 px-6 text-left">{task.companyName || "N/A"}</td>
              </tr>
          ))}
          </tbody>
        </table>
    );
  };

  return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Tasks Done By Users</h1>
        {Object.keys(groupedDoneData).length > 0 ? (
            Object.keys(groupedDoneData).map((email) => (
                <div key={email} className="mb-12">
                  <h2 className="text-xl font-semibold mb-4">Done By: {email}</h2>
                  {renderTasks(groupedDoneData[email])}
                </div>
            ))
        ) : (
            <p>No completed tasks available.</p>
        )}
      </div>
  );
};

export default DoneTasksByUser;
