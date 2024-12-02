'use client';

import React, { useState, useEffect } from "react";
import { query, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { format } from "date-fns";
import Link from "next/link";

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
      return format(date, "Pp");
    } catch {
      return "Invalid Date";
    }
  };

  const calculateTimeDifference = (
    start?: { seconds: number; nanoseconds: number },
    end?: { seconds: number; nanoseconds: number }
  ): string => {
    if (!start || !end) return "N/A";

    try {
      const startTime = start.seconds * 1000 + Math.floor(start.nanoseconds / 1e6);
      const endTime = end.seconds * 1000 + Math.floor(end.nanoseconds / 1e6);

      const difference = endTime - startTime;
      if (difference < 0) return "Invalid Times";

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    } catch {
      return "Error Calculating";
    }
  };

  useEffect(() => {
    const q = query(collection(db, "customer_issues"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

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
            <th className="py-3 px-6 text-left">Done Time</th>
            <th className="py-3 px-6 text-left">Time Difference</th>
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
              <td className="py-3 px-6 text-left">{task.customerName || "N/A"}</td>
              <td className="py-3 px-6 text-left">{formatTimestamp(task.processingTime)}</td>
              <td className="py-3 px-6 text-left">{formatTimestamp(task.doneTime)}</td>
              <td className="py-3 px-6 text-left">
                {calculateTimeDifference(task.processingTime, task.doneTime)}
              </td>
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

<button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300">
  <Link href="/">Back</Link>
</button>

    </div>
  );
};

export default DoneTasksByUser;
