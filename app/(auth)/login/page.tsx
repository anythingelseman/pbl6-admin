"use client";

import { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { PiFilmReelBold } from "react-icons/pi";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
const apiUrl = process.env.API_URL;
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeNo: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        // `http://cinemawebapi.ddns.net:8001/api/identity/token/`,
        // `http://192.168.124.47:8001/api/identity/token`,
        `https://apideploy.azurewebsites.net/api/identity/token`,

        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      if (result.data.role === "Customer")
        throw new Error("You are not an admin");

      if (result.succeeded == true) {
        localStorage.setItem("USER", JSON.stringify(result.data));
        router.push("/manage/films");
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-slate-800">
      <Link
        href="/"
        className="flex items-center mb-6 text-2xl font-semibold text-white "
      >
        <PiFilmReelBold className="h-10 w-10" />
        <span className="self-center whitespace-nowrap pl-3 text-xl font-semibold text-white">
          Cinema Admin
        </span>
      </Link>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <input
                type="text"
                name="employeeNo"
                id="employeeNo"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Username"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start"></div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
