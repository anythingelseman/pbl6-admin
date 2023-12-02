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
const apiUrl = process.env.API_URL;

interface RoomData {
  id?: number;
  name: string | undefined;
  numberSeat: number | undefined;
  status: number | undefined;
  cinemaId: number | undefined;
  createdOn?: string;
  lastModifiedOn?: string;
  numberRow?: number;
  numberColumn?: number;
}

interface RoomApiResponse {
  messages: string[];
  succeeded: boolean;
  data: RoomData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface CinemaData {
  id?: number;
  name: string;
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
  roomApiResponse: RoomApiResponse | undefined;
  currentSearched: string;
  setRoomApiResponse: React.Dispatch<
    React.SetStateAction<RoomApiResponse | undefined>
  >;
}

export default function RoomPage() {
  const [cinemaApiResponse, setCinemaApiResponse] =
    useState<CinemaApiResponse>();
  const [roomApiResponse, setRoomApiResponse] = useState<RoomApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response1 = await apiClient.get(`/cinema?PageSize=100&OrderBy=id`);
      const data1 = response1.data;
      setCinemaApiResponse(data1);
      const response2 = await apiClient.get(`/Room?OrderBy=id`);
      const data2 = response2.data;
      setRoomApiResponse(data2);
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
        `/Room?Keyword=${searchTerm}&OrderBy=id`
      );
      const data = response.data;
      setRoomApiResponse(data);
      console.log(data);
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
              Room
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
              <AddRoomModal
                cinemaData={cinemaApiResponse?.data}
                handleRefetch={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <RoomTable
                cinemaApiResponse={cinemaApiResponse}
                roomApiResponse={roomApiResponse}
                handleRefetch={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        roomApiResponse={roomApiResponse}
        currentSearched={currentSearched}
        setRoomApiResponse={setRoomApiResponse}
      />
    </>
  );
}

const AddRoomModal: React.FC<{
  cinemaData: CinemaData[] | undefined;
  handleRefetch: () => void;
}> = ({ cinemaData, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<RoomData>({
    name: "",
    numberSeat: 0,
    status: 1,
    cinemaId: 1,
    numberRow: 0,
    numberColumn: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : Number(value), // Convert to number for ID
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
      toast.error("Please fill in all the fields");
      return;
    }
    apiClient
      .post(`/Room`, JSON.stringify(formData))
      .then((response) => {
        handleRefetch();
        setOpen(false);
        setFormData({
          name: "",
          numberSeat: 0,
          status: 1,
          cinemaId: 1,
          numberRow: 0,
          numberColumn: 0,
        });
        toast.success("Add room successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add room
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
              <Label>Name</Label>
              <TextInput name="name" className="mt-1" onChange={handleChange} />
            </div>
            <div>
              <Label>Number of seats</Label>
              <TextInput
                type="number"
                name="numberSeat"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div className="mt-3 flex max-w-md flex-col gap-4">
              <Label className="text-md">Status</Label>
              <div className="flex items-center gap-2">
                <Radio
                  id="available"
                  name="status"
                  value="1"
                  defaultChecked
                  onChange={handleChange}
                />
                <Label htmlFor="available">Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="close"
                  name="status"
                  value="0"
                  onChange={handleChange}
                />
                <Label htmlFor="close">Close</Label>
              </div>
            </div>
            <div className="mb-3 mt-3">
              <Label>Number of row</Label>
              <TextInput
                type="number"
                name="numberRow"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Label>Number of column</Label>
              <TextInput
                type="number"
                name="numberColumn"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Select the cinema" />
              </div>
              <Select name="cinemaId" onChange={handleChange} required>
                <option selected value="">
                  Select cinema
                </option>
                {cinemaData?.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                ))}
              </Select>
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
  data: RoomData | undefined;
  cinemaData: CinemaData[] | undefined;
  handleRefetch: () => void;
}> = ({ data, cinemaData, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);

  const [formData, setFormData] = useState<RoomData>({
    id: data?.id,
    name: data?.name,
    numberSeat: data?.numberSeat,
    status: data?.status,
    cinemaId: data?.cinemaId,
    numberRow: data?.numberRow,
    numberColumn: data?.numberColumn,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : Number(value), // Convert to number for ID
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
      toast.error("Please fill in all the fields");
      return;
    }
    apiClient
      .put(`/Room`, JSON.stringify(formData))
      .then((response) => {
        setOpen(false);
        handleRefetch();
        toast.success("Edit room successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
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
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div>
              <Label>Name</Label>
              <TextInput
                name="name"
                className="mt-1"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div>
              <Label>Number of seats</Label>
              <TextInput
                type="number"
                name="numberSeat"
                className="mt-1"
                onChange={handleChange}
                value={formData.numberSeat}
              />
            </div>
            <div className="mt-3 flex max-w-md flex-col gap-4">
              <Label className="text-md">Status</Label>
              <div className="flex items-center gap-2">
                <Radio
                  id="available"
                  name="status"
                  value="1"
                  checked={formData?.status == 1}
                  onChange={handleChange}
                />
                <Label htmlFor="available">Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="close"
                  name="status"
                  value="0"
                  checked={formData?.status == 0}
                  onChange={handleChange}
                />
                <Label htmlFor="close">Close</Label>
              </div>
            </div>
            <div className="mb-3 mt-3">
              <Label>Number of row</Label>
              <TextInput
                type="number"
                name="numberRow"
                className="mt-1"
                onChange={handleChange}
                value={formData.numberRow}
              />
            </div>
            <div className="mb-3">
              <Label>Number of column</Label>
              <TextInput
                type="number"
                name="numberColumn"
                className="mt-1"
                onChange={handleChange}
                value={formData.numberColumn}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Select the cinema" />
              </div>
              <Select
                name="cinemaId"
                onChange={handleChange}
                value={formData.cinemaId}
                required
              >
                {cinemaData?.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                ))}
              </Select>
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
  roomId: number | undefined;
  handleRefetch: () => void;
}> = ({ roomId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/Room?Id=${roomId}`)
      .then((response) => {
        handleRefetch();
        toast.success("Delete room successfully");
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
              Are you sure you want to delete this room?
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

const RoomTable: React.FC<{
  cinemaApiResponse: CinemaApiResponse | undefined;
  roomApiResponse: RoomApiResponse | undefined;
  handleRefetch: () => void;
}> = ({ cinemaApiResponse, roomApiResponse, handleRefetch }) => {
  const getCinemaNameById = (id: number | undefined): string | null => {
    const cinemaData = cinemaApiResponse?.data.find((c) => c.id === id);
    if (!cinemaData) return null;
    return cinemaData?.name;
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Number of seats</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Cinema</Table.HeadCell>
        <Table.HeadCell>Row</Table.HeadCell>
        <Table.HeadCell>Column</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {roomApiResponse?.data &&
          roomApiResponse.data.map((data) => (
            <RoomRow
              data={data}
              key={data.id}
              cinemaName={getCinemaNameById(data?.cinemaId)}
              cinemaData={cinemaApiResponse?.data}
              handleRefetch={handleRefetch}
            />
          ))}
      </Table.Body>
    </Table>
  );
};

const RoomRow: React.FC<{
  data: RoomData | undefined;
  cinemaName: string | null;
  cinemaData: CinemaData[] | undefined;
  handleRefetch: () => void;
}> = ({ data, cinemaName, cinemaData, handleRefetch }) => {
  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {data?.name}
        </div>
        <div className="text-sm font-normal text-gray-500 "></div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.numberSeat}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.status === 1 ? "Available" : "Close"}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {cinemaName}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.numberRow}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.numberColumn}
      </Table.Cell>

      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          <EditProductModal
            data={data}
            cinemaData={cinemaData}
            handleRefetch={handleRefetch}
          />
          <DeleteProductModal roomId={data?.id} handleRefetch={handleRefetch} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};
const Pagination: React.FC<PaginationComponentProps> = ({
  roomApiResponse,
  currentSearched,
  setRoomApiResponse,
}) => {
  const NextPageHandle = async () => {
    try {
      if (!roomApiResponse) return;
      const response = await apiClient.get(
        `/Room?Keyword=${currentSearched}&PageNumber=${
          roomApiResponse?.currentPage + 1
        }&OrderBy=id`
      );
      const data = await response.data;
      setRoomApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!roomApiResponse) return;
      const response = await apiClient.get(
        `/Room?Keyword=${currentSearched}&PageNumber=${
          roomApiResponse?.currentPage - 1
        }&OrderBy=id`
      );
      const data = await response.data;
      setRoomApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={!roomApiResponse?.hasPreviousPage}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          roomApiResponse?.hasPreviousPage
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
            {roomApiResponse?.currentPage}
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {roomApiResponse?.totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={!roomApiResponse?.hasNextPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          roomApiResponse?.hasNextPage
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
