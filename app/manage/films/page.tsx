"use client";
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";
import {
  Button,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
  Datepicker,
  Checkbox,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const apiUrl = process.env.API_URL;
interface FilmData {
  id?: number;
  name: string;
  actor: string;
  direct?: string;
  director?: string;
  producer?: string;
  duration: number;
  description: string;
  year: number;
  country: string;
  limitAge: number;
  trailer: string;
  startDate: string; // This should be a valid date string format
  endDate: string; // This should be a valid date string format
  listIdCategory: number[];
  category?: string;
  fileImages: any;
  image?: string;
  createdOn?: string; // This should be a valid date string format
  lastModifiedOn?: string; // This should be a valid date string format
}

interface FilmApiResponse {
  messages: string[];
  succeeded: boolean;
  data: FilmData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface CategoryData {
  id: number;
  name: string;
  createdOn: string;
  lastModifiedOn: string | null;
}

interface CategoryApiResponse {
  data: CategoryData[];
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
  filmApiResponse: FilmApiResponse | undefined;
  currentSearched: string;
  setFilmApiResponse: React.Dispatch<
    React.SetStateAction<FilmApiResponse | undefined>
  >;
}

export default function FilmsPage() {
  const [CategoryApiResponse, setCategoryApiResponse] =
    useState<CategoryApiResponse>();
  const [filmApiResponse, setFilmApiResponse] = useState<FilmApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get<FilmApiResponse | undefined>(
        `/film?OrderBy=id`
      );
      setFilmApiResponse(response.data);
      console.log(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get<CategoryApiResponse | undefined>(
        `/category?PageSize=50&OrderBy=id`
      );
      setCategoryApiResponse(response.data);
      console.log(response.data);
    };
    fetchData();
  }, []);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchHandle = async () => {
    try {
      setCurrentSearched(searchTerm);
      const response = await apiClient.get<FilmApiResponse | undefined>(
        `/film?Keyword=${searchTerm}&OrderBy=id`
      );
      setFilmApiResponse(response.data);
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
              Films
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
              <AddProductModal categoryData={CategoryApiResponse?.data} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <FilmTable filmApiResponse={filmApiResponse} />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        filmApiResponse={filmApiResponse}
        currentSearched={currentSearched}
        setFilmApiResponse={setFilmApiResponse}
      />
    </>
  );
}

const AddProductModal: React.FC<{
  categoryData: CategoryData[] | undefined;
}> = ({ categoryData }) => {
  const [isOpen, setOpen] = useState(false);
  const [uploadImages, setUploadImages] = useState<any>();
  const [formData, setFormData] = useState<FilmData>({
    name: "",
    actor: "",
    director: "",
    producer: "",
    duration: 0,
    description: "",
    year: 0,
    country: "",
    limitAge: 0,
    trailer: "",
    startDate: "",
    endDate: "",
    listIdCategory: [],
    fileImages: [
      {
        nameFile: "",
        typeFile: "",
      },
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleCheckboxChange = (categoryId: number) => {
    setFormData((prevState) => {
      const isSelected = prevState.listIdCategory.includes(categoryId);
      return {
        ...prevState,
        listIdCategory: isSelected
          ? prevState.listIdCategory.filter((id) => id !== categoryId)
          : [...prevState.listIdCategory, categoryId],
      };
    });
    console.log(formData);
  };

  const customAfter = (event: any) => {
    const file = event.target.files[0];
    file.objectURL = URL.createObjectURL(event.target.files[0]);
    console.log(file);
    if (
      uploadImages?.filter((e: any) => {
        return e.name == file.name;
      }).length
    ) {
      console.log("already add img");
    } else {
      setUploadImages([
        ...(uploadImages == undefined ? [] : uploadImages),
        file,
      ]);
      console.log("uploadImages" + uploadImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InN1cGVyYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsZWhpZXUucXJ0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJOZ3V5ZW4gUGh1b2MgTGUgSGlldSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJhZG1pbiIsImV4cCI6MTY5ODY1MzY3Nn0.YOAPHdUMJlhgXeLPKokS9AW6ew3Sv6Cn23uIZh8ddK8
    e.preventDefault();
    setOpen(false);

    const uploadPromises = uploadImages.map(async (img: any) => {
      const image = new FormData();
      image.append("filePath", img.name);
      image.append("file", img);
      console.log("formData" + image.get("filePath"));

      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: image,
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InN1cGVyYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsZWhpZXUucXJ0QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJOZ3V5ZW4gUGh1b2MgTGUgSGlldSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJhZG1pbiIsImV4cCI6MTY5OTYwMjA5OH0.vCpj9xNmw-H7LF8-yGJTB6QRJ3w7kdvtEjgFIC57KF0",
        },
      });

      const result = await response.json();
      console.log(result);
      return {
        nameFile: result.data.filePath,
        typeFile: "Image",
      };
    });

    Promise.all(uploadPromises)
      .then(async (uploadedImages) => {
        const response = await apiClient.post(
          `/film`,
          JSON.stringify({ ...formData, fileImages: uploadedImages })
        );

        console.log("Data film posted successfully:", response.data);
        return response.data;
      })
      .then((result) => {
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add film
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add film</strong>
        </Modal.Header>
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label>Name</Label>
                <TextInput
                  name="name"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Actor</Label>
                <TextInput
                  name="actor"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Director</Label>
                <TextInput
                  name="director"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Producer</Label>
                <TextInput
                  name="producer"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Duration</Label>
                <TextInput
                  type="number"
                  name="duration"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Country</Label>
                <TextInput
                  name="country"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Year</Label>
                <TextInput
                  type="number"
                  name="year"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Age limit</Label>
                <TextInput
                  type="number"
                  name="limitAge"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="price">Start date: </Label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="rounded"
                />
              </div>

              <div>
                <Label>End date: </Label>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  className="rounded"
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Category</Label>
              </div>

              {categoryData &&
                categoryData.map((data) => (
                  <div key={data.id}>
                    <Checkbox
                      className="mx-3"
                      name="listIdCategory"
                      id={data.id.toString()}
                      onChange={() => handleCheckboxChange(data.id)}
                    />
                    <Label htmlFor={data.id.toString()}>{data.name}</Label>
                  </div>
                ))}

              <div className="lg:col-span-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  rows={6}
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Trailer</Label>
                <TextInput
                  onChange={handleChange}
                  name="trailer"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload an image or drag and drop
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={customAfter}
                    />
                  </label>
                </div>

                <div className="flex">
                  {uploadImages?.map(
                    (img: any, index: React.Key | null | undefined) => {
                      return (
                        <div className="img-wrap" key={index}>
                          <img
                            src={img.objectURL}
                            height={"120px"}
                            width={"150px"}
                          />
                          <span
                            className=""
                            onClick={(e) => {
                              let images = uploadImages.filter((el: any) => {
                                if (el.name !== img.name) return el;
                              });
                              setUploadImages([...images]);
                            }}
                          >
                            &times;
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
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

const EditProductModal = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="mr-2 text-lg" />
        Edit
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 ">
          <strong>Edit film</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Actor</Label>
                <TextInput id="category" name="category" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="brand">Director</Label>
                <TextInput id="brand" name="brand" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="price">Duration</Label>
                <TextInput id="price" name="price" className="mt-1" />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Description</Label>
                <Textarea
                  id="producTable.Celletails"
                  name="producTable.Celletails"
                  rows={6}
                  className="mt-1"
                />
                \
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Trailer</Label>
                <TextInput
                  id="producTable.Celletails"
                  name="producTable.Celletails"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Year</Label>
                <TextInput
                  id="producTable.Celletails"
                  name="producTable.Celletails"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload an image or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-sky-600" onClick={() => setOpen(false)}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteProductModal: React.FC<{
  filmId: number | undefined;
}> = ({ filmId }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/film?Id=${filmId}`)
      // .then((response) => {
      //   if (!response.status ) {
      //     throw new Error("Network response was not ok");
      //   }
      //   return response.data;
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
              Are you sure you want to delete this film?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={deleteHandle}>
                Yes, I'm sure
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

const FilmTable: React.FC<{
  filmApiResponse: FilmApiResponse | undefined;
}> = ({ filmApiResponse }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Actor</Table.HeadCell>
        <Table.HeadCell>Director</Table.HeadCell>
        <Table.HeadCell>Duration</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell>Year</Table.HeadCell>
        <Table.HeadCell>Country</Table.HeadCell>
        <Table.HeadCell>Age limit</Table.HeadCell>
        <Table.HeadCell>Trailer</Table.HeadCell>
        <Table.HeadCell>Start Date</Table.HeadCell>
        <Table.HeadCell>End Date</Table.HeadCell>
        <Table.HeadCell>Category</Table.HeadCell>
        <Table.HeadCell>Image</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {filmApiResponse?.data &&
          filmApiResponse.data.map((data) => (
            <FilmRow data={data} key={data.id} />
          ))}
      </Table.Body>
    </Table>
  );
};

const FilmRow: React.FC<{ data: FilmData | undefined }> = ({ data }) => {
  const formatDate = (date: string) => {
    const dateObject = new Date(date);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Month is 0-indexed, so we add 1
    const day = dateObject.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {data?.name}
        </div>
        <div className="text-sm font-normal text-gray-500 "></div>
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.actor}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.director}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.duration}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        <div className="w-[200px] overflow-hidden text-ellipsis whitespace-pre-line">
          {data?.description}
        </div>
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.year}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.country}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.limitAge}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.trailer}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data && formatDate(data?.startDate)}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data && formatDate(data?.endDate)}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.category}
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        <img src={data?.image} />
      </Table.Cell>
      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          {/* <EditProductModal /> */}
          <DeleteProductModal filmId={data?.id} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export const Pagination: React.FC<PaginationComponentProps> = ({
  filmApiResponse,
  currentSearched,
  setFilmApiResponse,
}) => {
  const NextPageHandle = async () => {
    try {
      if (!filmApiResponse) return;
      const response = await apiClient.get<FilmApiResponse | undefined>(
        `/film?Keyword=${currentSearched}&PageNumber=${
          filmApiResponse?.currentPage + 1
        }&OrderBy=id`
      );
      setFilmApiResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!filmApiResponse) return;
      const response = await apiClient.get(
        `/film?Keyword=${currentSearched}&PageNumber=${
          filmApiResponse?.currentPage - 1
        }&OrderBy=id`
      );
      const data = response.data;
      setFilmApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={!filmApiResponse?.hasPreviousPage}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          filmApiResponse?.hasPreviousPage
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
            {filmApiResponse?.currentPage}
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {filmApiResponse?.totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={!filmApiResponse?.hasNextPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          filmApiResponse?.hasNextPage
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
