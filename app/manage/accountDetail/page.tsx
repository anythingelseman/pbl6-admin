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

interface EmployeeData {
  id?: number;
  address?: string;
  name?: string | undefined;
  gender?: boolean | undefined;
  phoneNumber?: number | undefined;
  workShiftId?: number;
  lastModifiedOn?: string;
  imageFile?: any;
  imageLink?: any;
  email?: string | undefined;
  password?: string | undefined;
  isAdmin?: boolean | undefined;
  image?: string | undefined;
  birthday?: string | undefined;
}

interface EmployeeApiResponse {
  messages: string[];
  succeeded: boolean;
  data: EmployeeData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface PaginationComponentProps {
  employeeApiResponse: EmployeeApiResponse | undefined;
  currentSearched: string;
  setEmployeeApiResponse: React.Dispatch<
    React.SetStateAction<EmployeeApiResponse | undefined>
  >;
}

export default function AccountDetailPage() {
  const [employee, setEmployee] = useState<EmployeeData>();

  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (user) {
        const response = await apiClient.get(`/employee/${user?.userId}`);
        const data = response.data.data;
        setEmployee(data);
      }

      setIsLoading(false);
    };
    fetchData();
  }, [refetchTrigger, user]);

  const handleRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };

  if (isLoading)
    return (
      <div className="flex justify-center content-center min-h-screen">
        <Spinner className="mt-60" />
      </div>
    );

  return (
    <>
      <div className="flex justify-center content-center min-h-screen mt-[40px]">
        <div className="min-w-[400px] bg-white  mt-3 h-fit p-5 rounded ">
          <div className="text-center text-lg font-bold">
            Thông tin tài khoản
          </div>
          <div className="flex justify-between my-4">
            <p>Họ và tên</p>
            <p>{employee?.name}</p>
          </div>
          <div className="flex justify-between my-4">
            <p>Email</p>
            <p>{employee?.email}</p>
          </div>
          <div className="flex justify-between my-4">
            <p>Giới tính</p>
            <p>{employee?.gender ? "Nam" : "Nữ"}</p>
          </div>
          <div className="flex justify-between my-4">
            <p>Ngày sinh</p>
            <p>{new Date(employee?.birthday!).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-between my-4">
            <p>Số điện thoại</p>
            <p>{employee?.phoneNumber}</p>
          </div>
          <div className="flex justify-between my-4">
            <p>Địa chỉ</p>
            <p>{employee?.address}</p>
          </div>
          <div className="flex justify-center">
            <EditModal handleRefetch={handleRefetch} employeeData={employee} />
          </div>
        </div>
      </div>
    </>
  );
}

const EditModal: React.FC<{
  handleRefetch: () => void;
  employeeData?: EmployeeData;
}> = ({ handleRefetch, employeeData }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<EmployeeData>({
    id: employeeData?.id,
    name: employeeData?.name,
    email: employeeData?.email,
    gender: employeeData?.gender,
    birthday: employeeData?.birthday,
    address: employeeData?.address,
    image: "a",
    phoneNumber: employeeData?.phoneNumber,
    workShiftId: 2,
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
    apiClient
      .put(`/employee`, JSON.stringify(formData))
      .then((response) => {
        handleRefetch();
        setOpen(false);
        toast.success("Chỉnh sửa thông tin thành công");
      })
      .catch((error: any) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        Chỉnh sửa thông tin
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Chỉnh sửa thông tin </strong>
        </Modal.Header>
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div>
              <Label className="text-md">Tên</Label>
              <TextInput
                name="name"
                className="mt-1"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div className="mt-2">
              <Label className="text-md">Địa chỉ</Label>
              <TextInput
                name="address"
                className="mt-1"
                onChange={handleChange}
                value={formData.address}
              />
            </div>
            <div className="mt-3">
              <Label className="text-md">Ngày sinh</Label>
              <br />
              <input
                type="date"
                name="birthday"
                onChange={handleChange}
                className="rounded mt-1"
                value={
                  new Date(formData.birthday!.split("T")[0] + "T00:00:00Z")
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>

            <div className="mt-2">
              <Label className="text-md">Email</Label>
              <TextInput
                name="email"
                className="mt-1"
                onChange={handleChange}
                type="email"
                value={formData.email}
              />
            </div>

            <div className="mt-2">
              <Label className="text-md">Số điện thoại</Label>
              <TextInput
                name="phoneNumber"
                className="mt-1"
                onChange={handleChange}
                value={formData.phoneNumber}
              />
            </div>

            <div className="mt-3 flex max-w-md flex-col gap-4">
              <Label className="text-md">Giới tính</Label>
              <div className="flex items-center gap-2">
                <Radio
                  id="male"
                  name="gender"
                  value="true"
                  checked={formData.gender === true}
                  onChange={handleChange}
                />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="female"
                  name="gender"
                  value="false"
                  onChange={handleChange}
                  checked={formData.gender === false}
                />
                <Label htmlFor="female">Nữ</Label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-sky-600" type="submit" id="Add-button">
              Chỉnh sửa
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
