"use client";

import apiClient from "@/services/apiClient";
import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const apiUrl = process.env.API_URL;

interface MovieCategory {
  id: number;
  name: string;
  createdOn: string;
  lastModifiedOn: string | null;
}

interface ApiResponse {
  data: MovieCategory[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: any[]; // Assuming this can be of any type, change it as per actual data structure
  succeeded: boolean;
}

interface PaginationComponentProps {
  categoryData: ApiResponse | undefined;
  currentSearched: string;
  setCategoryData: React.Dispatch<
    React.SetStateAction<ApiResponse | undefined>
  >;
}

export default function CategoryPage() {
  const [categoryData, setCategoryData] = useState<ApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(`/category?OrderBy=id`);
      const data = response.data;
      setCategoryData(data);
      console.log(data);
    };
    fetchData();
  }, []);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchHandle = async () => {
    try {
      setCurrentSearched(searchTerm);
      const response = await apiClient.get(
        `/category?Keyword=${searchTerm}&OrderBy=id`
      );
      const data = response.data;
      setCategoryData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Category
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

            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <CategoryTable categoryData={categoryData} />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        categoryData={categoryData}
        currentSearched={currentSearched}
        setCategoryData={setCategoryData}
      />
    </>
  );
}

const AddProductModal = function () {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setOpen(false);
    try {
      const response = await apiClient.post(
        `${apiUrl}/category`,
        JSON.stringify(formData)
      );
      const result = response.data;
      console.log("Data posted successfully:", result);
      location.reload();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add </strong>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <TextInput
                  id="name"
                  name="name"
                  className="mt-1"
                  onChange={handleChange}
                />
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

const CategoryTable: React.FC<{
  categoryData: ApiResponse | undefined;
}> = ({ categoryData }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Id</Table.HeadCell>
        <Table.HeadCell>Category Name</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {categoryData?.data &&
          categoryData.data.map((data) => (
            <CategoryRow data={data} key={data.id} />
          ))}
      </Table.Body>
    </Table>
  );
};

const CategoryRow: React.FC<{ data: MovieCategory | undefined }> = ({
  data,
}) => {
  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {data?.id}
        </div>
        <div className="text-sm font-normal text-gray-500 dark:text-gray-400"></div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
        {data?.name}
      </Table.Cell>
    </Table.Row>
  );
};

export const Pagination: React.FC<PaginationComponentProps> = ({
  categoryData,
  currentSearched,
  setCategoryData,
}) => {
  const NextPageHandle = async () => {
    try {
      if (!categoryData) return;
      const response = await apiClient.get(
        `/category?Keyword=${currentSearched}&PageNumber=${
          categoryData?.currentPage + 1
        }&OrderBy=id`
      );
      const data = response.data;
      setCategoryData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!categoryData) return;
      const response = await apiClient.get(
        `/category?Keyword=${currentSearched}&PageNumber=${
          categoryData?.currentPage - 1
        }&OrderBy=id`
      );
      const data = response.data();
      setCategoryData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={!categoryData?.hasPreviousPage}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          categoryData?.hasPreviousPage
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
            {categoryData?.currentPage}
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {categoryData?.totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={!categoryData?.hasNextPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          categoryData?.hasNextPage
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
