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
} from "flowbite-react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface CinemaData {
  id?: number;
  name: string | undefined;
  description: string | undefined;
  city: string | undefined;
  createdOn?: string;
  lastModifiedOn?: string;
}

interface CinemaApiResponse {
  messages: string[];
  succeeded: boolean;
  data: CinemaData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface PaginationComponentProps {
  cinemaApiResponse: CinemaApiResponse | undefined;
  currentSearched: string;
  setCinemaApiResponse: React.Dispatch<
    React.SetStateAction<CinemaApiResponse | undefined>
  >;
}

export default function CinemaPage() {
  const [cinemaApiResponse, setCinemaApiResponse] =
    useState<CinemaApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get<CinemaApiResponse | undefined>(
        `/cinema?OrderBy=id`
      );
      const data = response.data;
      setCinemaApiResponse(data);
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
        `/cinema?Keyword=${searchTerm}&OrderBy=id`
      );
      const data = response.data;
      setCinemaApiResponse(data);
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
              Cinema
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
              <AddCinemaModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <CinemaTable cinemaApiResponse={cinemaApiResponse} />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        cinemaApiResponse={cinemaApiResponse}
        currentSearched={currentSearched}
        setCinemaApiResponse={setCinemaApiResponse}
      />
    </>
  );
}

const AddCinemaModal = function () {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<CinemaData>({
    name: "",
    description: "",
    city: "",
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
    apiClient
      .post(`/cinema`, JSON.stringify(formData))
      .then((response) => {
        console.log("Post request was successful:", response.data);
        location.reload();
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add cinema
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
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div>
              <Label>Name</Label>
              <TextInput name="name" className="mt-1" onChange={handleChange} />
            </div>
            <div>
              <Label>Description</Label>
              <TextInput
                name="description"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>City</Label>
              <TextInput name="city" className="mt-1" onChange={handleChange} />
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

const EditProductModal: React.FC<{
  data: CinemaData | undefined;
}> = ({ data }) => {
  const [isOpen, setOpen] = useState(false);

  const [formData, setFormData] = useState<CinemaData>({
    id: data?.id,
    name: data?.name,
    description: data?.description,
    city: data?.city,
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
    apiClient
      .put(`/cinema`, JSON.stringify(formData))
      .then((response) => {
        const result = response.data;
        console.log("Put request was successful:", result);
        location.reload();
      })
      .catch((error) => {
        console.error("Error putting data:", error);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="mr-2 text-lg" />
        Edit
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit </strong>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div>
              <Label>Name</Label>
              <TextInput
                name="name"
                className="mt-1"
                onChange={handleChange}
                value={formData?.name}
              />
            </div>
            <div>
              <Label>Description</Label>
              <TextInput
                name="description"
                className="mt-1"
                onChange={handleChange}
                value={formData?.description}
              />
            </div>
            <div>
              <Label>City</Label>
              <TextInput
                name="city"
                className="mt-1"
                onChange={handleChange}
                value={formData?.city}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-sky-600" type="submit">
              Update
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

const DeleteProductModal: React.FC<{
  cinemaId: number | undefined;
}> = ({ cinemaId }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/cinema?Id=${cinemaId}`)
      // .then((response) => {
      //   if (!response.ok) {
      //     throw new Error("Network response was not ok");
      //   }
      //   return response.json();
      // })
      .then((response) => {
        console.log("Delete request was successful:", response.data);
        location.reload();
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
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
              Are you sure you want to delete this cinema?
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

const CinemaTable: React.FC<{
  cinemaApiResponse: CinemaApiResponse | undefined;
}> = ({ cinemaApiResponse }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell>City</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {cinemaApiResponse?.data &&
          cinemaApiResponse.data.map((data) => (
            <CinemaRow data={data} key={data.id} />
          ))}
      </Table.Body>
      {/* <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              CGV Da Nang
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400"></div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            41 Ton Duc Thang - Da Nang
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            <div className="flex gap-x-3 justify-center content-center mb-3">
              <div className="flex justify-center items-center">Room 1</div>
              <ChangeNameModal />
              <DeleteProductModal />
            </div>

            <div className="flex gap-x-3 justify-center content-center">
              <div className="flex justify-center items-center">Room 2</div>
              <ChangeNameModal />
              <DeleteProductModal />
            </div>
          </Table.Cell>

          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </Table.Cell>
        </Table.Row> */}
    </Table>
  );
};

const CinemaRow: React.FC<{ data: CinemaData | undefined }> = ({ data }) => {
  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {data?.name}
        </div>
        <div className="text-sm font-normal text-gray-500 "></div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.description}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.city}
      </Table.Cell>

      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          <EditProductModal data={data} />
          <DeleteProductModal cinemaId={data?.id} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

const Pagination: React.FC<PaginationComponentProps> = ({
  cinemaApiResponse,
  currentSearched,
  setCinemaApiResponse,
}) => {
  const NextPageHandle = async () => {
    try {
      if (!cinemaApiResponse) return;
      const response = await apiClient.get(
        `/cinema?Keyword=${currentSearched}&PageNumber=${
          cinemaApiResponse?.currentPage + 1
        }&OrderBy=id`
      );
      const data = response.data;
      setCinemaApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!cinemaApiResponse) return;
      const response = await apiClient.get(
        `/cinema?Keyword=${currentSearched}&PageNumber=${
          cinemaApiResponse?.currentPage - 1
        }&OrderBy=id`
      );
      const data = response.data;
      setCinemaApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={!cinemaApiResponse?.hasPreviousPage}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          cinemaApiResponse?.hasPreviousPage
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
            {cinemaApiResponse?.currentPage}
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {cinemaApiResponse?.totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={!cinemaApiResponse?.hasNextPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          cinemaApiResponse?.hasNextPage
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
