"use client";

import { useUser } from "@/app/hooks/useUser";
import apiClient from "@/services/apiClient";
import { em } from "@fullcalendar/core/internal-common";
import {
  Button,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
  Datepicker,
  Select,
  Spinner,
  Radio,
} from "flowbite-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function ChangePasswordPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
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
    if (
      Object.values(formData).some(
        (value) =>
          (typeof value === "string" && value.trim() === "") ||
          value === null ||
          value === undefined
      )
    ) {
      toast.error("Hãy điền đầy đủ thông tin");
      return;
    }

    if (formData["newPassword"] !== formData["confirmNewPassword"]) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    apiClient
      .post(
        `http://cinephilewebapi.southeastasia.cloudapp.azure.com/api/account/change-password`,
        JSON.stringify(formData)
      )
      .then((response) => {
        toast.success("Đổi mật khẩu thành công");
        setFormData({
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      })
      .catch((error: any) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <div className="flex justify-center content-center min-h-screen mt-[40px]">
        <div className="min-w-[400px] bg-white  mt-3 h-fit p-5 rounded ">
          <div className="text-center text-lg font-bold">Đổi mật khẩu</div>

          <div className="mt-5">
            <Label className="mb-2">Mật khẩu cũ</Label>
            <TextInput
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className="mt-5">
            <Label className="mb-2">Mật khẩu mới</Label>
            <TextInput
              name="newPassword"
              type="password"
              onChange={handleChange}
              value={formData.newPassword}
            />
          </div>

          <div className="mt-5">
            <Label className="mb-2">Xác nhận mật khẩu</Label>
            <TextInput
              name="confirmNewPassword"
              type="password"
              onChange={handleChange}
              value={formData.confirmNewPassword}
            />
          </div>

          <div className="flex justify-center mt-5">
            <Button className="bg-sky-600" onClick={handleSubmit}>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
