"use client";

import apiClient from "@/services/apiClient";
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

export default function EmployeePage() {
  const [employeeApiResponse, setEmployeeApiResponse] =
    useState<EmployeeApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await apiClient.get(`/employee?OrderBy=id`);
      const data = response.data;
      setEmployeeApiResponse(data);
      setIsLoading(false);
      setCurrentSearched("");
      setSearchTerm("");
    };
    fetchData();
  }, [refetchTrigger]);

  const handleRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchHandle = async () => {
    try {
      setCurrentSearched(searchTerm);
      const response = await apiClient.get(
        `/employee?Keyword=${searchTerm}&OrderBy=id`
      );
      const data = response.data;
      setEmployeeApiResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center content-center min-h-screen">
        <Spinner className="mt-60" />
      </div>
    );

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Employee
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="mb-4 sm:mb-0 sm:pr-3 ">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative mt-1 lg:w-64 xl:w-96 flex gap-x-3">
                <TextInput
                  className="w-[400px]"
                  id="search"
                  name="search"
                  placeholder="Name search "
                  value={searchTerm}
                  onChange={changeHandle}
                />
                <Button className="bg-sky-600" onClick={searchHandle}>
                  Search
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center sm:justify-end gap-x-3">
              <AddEmployeeModal handleRefetch={handleRefetch} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <EmployeeTable
                employeeApiResponse={employeeApiResponse}
                handleRefetch={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>

      <Pagination
        employeeApiResponse={employeeApiResponse}
        currentSearched={currentSearched}
        setEmployeeApiResponse={setEmployeeApiResponse}
      />
    </>
  );
}

const AddEmployeeModal: React.FC<{
  handleRefetch: () => void;
}> = ({ handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const initialData = {
    name: "",
    address: "",
    birthday: "",
    gender: true,
    image: "a",
    password: "",
    username: "",
    phoneNumber: 0,
    email: "",
    workShiftId: 2,
    isAdmin: true,
  };
  const [formData, setFormData] = useState<EmployeeData>(initialData);

  const handleValue = (name: string, value: string) => {
    if (name === "isAdmin" || name === "gender") return value === "true";
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: handleValue(name, value),
    });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password)
      if (
        Object.values(formData).some(
          (value) =>
            (typeof value === "string" && value.trim() === "") ||
            value === null ||
            value === undefined
        )
      ) {
        toast.error("Please fill in all the fields");
        return;
      }
    apiClient
      .post(`/employee`, JSON.stringify(formData))
      .then((response) => {
        handleRefetch();
        setOpen(false);
        setFormData(initialData);
        toast.success("Add employee successfully");
      })
      .catch((error: any) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add employee
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add </strong>
        </Modal.Header>
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div>
              <Label className="text-md">Name</Label>
              <TextInput name="name" className="mt-1" onChange={handleChange} />
            </div>
            <div className="mt-2">
              <Label className="text-md">Address</Label>
              <TextInput
                name="address"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <Label className="text-md">Birthday</Label>
              <br />
              <input
                type="date"
                name="birthday"
                onChange={handleChange}
                className="rounded mt-1"
              />
            </div>

            <div className="mt-2">
              <Label className="text-md">Email</Label>
              <TextInput
                name="email"
                className="mt-1"
                onChange={handleChange}
                type="email"
              />
            </div>

            <div className="mt-2">
              <Label className="text-md">Phone number</Label>
              <TextInput
                name="phoneNumber"
                className="mt-1"
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 flex max-w-md flex-col gap-4">
              <Label className="text-md">Gender</Label>
              <div className="flex items-center gap-2">
                <Radio
                  id="male"
                  name="gender"
                  value="true"
                  defaultChecked
                  onChange={handleChange}
                />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="female"
                  name="gender"
                  value="false"
                  onChange={handleChange}
                />
                <Label htmlFor="female">Female</Label>
              </div>
            </div>

            <div className="mt-2">
              <Label className="text-md">Username</Label>
              <TextInput
                name="username"
                className="mt-1"
                onChange={handleChange}
              />
            </div>

            <div className="mt-2">
              <Label className="text-md">Password</Label>
              <TextInput
                name="password"
                className="mt-1"
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 flex max-w-md flex-col gap-4">
              <Label className="text-md">Role</Label>
              <div className="flex items-center gap-2">
                <Radio
                  id="admin"
                  name="isAdmin"
                  value="true"
                  defaultChecked
                  onChange={handleChange}
                />
                <Label htmlFor="admin">Admin</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="employee"
                  name="isAdmin"
                  value="false"
                  onChange={handleChange}
                />
                <Label htmlFor="employee">Employee</Label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-sky-600" type="submit">
              Add
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

const DeleteProductModal: React.FC<{
  employeeId: number | undefined;
  handleRefetch: () => void;
}> = ({ employeeId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/employee?Id=${employeeId}`)

      .then((response) => {
        handleRefetch();
        toast.success("Delete employee successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Delete
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0 text-center">
          <span>Delete product</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={deleteHandle}>
                Yes, Im sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const EmployeeTable: React.FC<{
  employeeApiResponse: EmployeeApiResponse | undefined;
  handleRefetch: () => void;
}> = ({ employeeApiResponse, handleRefetch }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Gender</Table.HeadCell>
        <Table.HeadCell>Phone Number</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {employeeApiResponse?.data &&
          employeeApiResponse.data.map((data) => (
            <EmployeeRow
              data={data}
              key={data.id}
              handleRefetch={handleRefetch}
            />
          ))}
      </Table.Body>
    </Table>
  );
};

const EmployeeRow: React.FC<{
  data: EmployeeData | undefined;
  handleRefetch: () => void;
}> = ({ data, handleRefetch }) => {
  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {data?.name}
        </div>
        <div className="text-sm font-normal text-gray-500 "></div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.gender ? "Nam" : "Nữ"}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.phoneNumber}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.email}
      </Table.Cell>

      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          <DeleteProductModal
            employeeId={data?.id}
            handleRefetch={handleRefetch}
          />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

const Pagination: React.FC<PaginationComponentProps> = ({
  employeeApiResponse,
  currentSearched,
  setEmployeeApiResponse,
}) => {
  const NextPageHandle = async () => {
    try {
      if (!employeeApiResponse) return;
      const response = await apiClient.get(
        `/employee?Keyword=${currentSearched}&PageNumber=${
          employeeApiResponse?.currentPage + 1
        }&OrderBy=id`
      );
      const data = response.data;
      setEmployeeApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!employeeApiResponse) return;
      const response = await apiClient.get(
        `/employee?Keyword=${currentSearched}&PageNumber=${
          employeeApiResponse?.currentPage - 1
        }&OrderBy=id`
      );
      const data = response.data;
      setEmployeeApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={!employeeApiResponse?.hasPreviousPage}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          employeeApiResponse?.hasPreviousPage
            ? "cursor-pointer hover:bg-gray-100 hover:text-gray-900"
            : "cursor-default disabled"
        } `}
      >
        <HiChevronLeft className="text-2xl" />
        <span>Previous </span>
      </button>

      <div>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing page&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {employeeApiResponse?.currentPage}
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {employeeApiResponse?.totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={!employeeApiResponse?.hasNextPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          employeeApiResponse?.hasNextPage
            ? "cursor-pointer hover:bg-gray-100 hover:text-gray-900"
            : "cursor-default"
        } `}
      >
        <span>Next</span>
        <HiChevronRight className="text-2xl" />
      </button>
    </div>
  );
};
