"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{1,14}$/, {
      message: "Enter a valid phone number.",
    }),
  complainCategory: z.string().min(1, {
    message: "Complain category is required.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 5 characters long.",
  }),
});


type FormData = {
  customerName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  complainCategory: string;
  description: string;
};

const Page = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      complainCategory: "",
      description: "",
    },
  });


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {

      const docRef = await addDoc(collection(db, "customer_issues"), {
        ...data,
        status: "TODO", 
        createdAt: serverTimestamp(), 
      });
      console.log("Document written with ID: ", docRef.id);
      
      console.log("Form submitted successfully");

      form.reset(); 
    } catch (error) {
      console.error("Error adding document: ", error);
       console.log("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gradient-to-r from-white via-white to-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-100 transition-transform duration-300 ease-in-out">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 leading-tight shadow-md">
          Customer Issue Form
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
          Please provide the details below to help us resolve your issue quickly.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">
                  Customer Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-300"
                    placeholder="Enter customer name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-300"
                    placeholder="Enter company name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complainCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">
                  Complain Category
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-300"
                  >
                    <option value="">Select a category</option>
                    <option value="system error">System error</option>
                    <option value="add more features">Add more features</option>
                    <option value="billing">Billing</option>
                    <option value="other">Other</option>
                  </select>
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-800">
                  Description
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors duration-300"
                    placeholder="Enter your description"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-600" />
              </FormItem>
            )}
          />

          <div className="flex justify-center w-full">
            <Button
              type="submit"
              className="w-32 py-3 bg-blue-600 text-white rounded-md transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
