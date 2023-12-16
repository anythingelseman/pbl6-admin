"use client";

import apiClient from "@/services/apiClient";
import globalRouter from "@/tools/globalRouter";
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
} from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface CinemaData {
  id?: number;
  name: string | undefined;
  description: string | undefined;
  city: string | undefined;
  hotline: string | undefined;
  longitude?: number;
  latitude?: number;
  address: string | undefined;
  listImage: any;
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
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await apiClient.get<CinemaApiResponse | undefined>(
        `/cinema?OrderBy=id`
      );
      const data = response.data;
      setCinemaApiResponse(data);
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
        `/cinema?Keyword=${searchTerm}&OrderBy=id`
      );
      const data = response.data;
      setCinemaApiResponse(data);
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
              <AddCinemaModal handleRefetch={handleRefetch} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <CinemaTable
                cinemaApiResponse={cinemaApiResponse}
                handleRefetch={handleRefetch}
              />
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

const AddCinemaModal: React.FC<{
  handleRefetch: () => void;
}> = ({ handleRefetch }) => {
  const inputRef = useRef<any>();
  const [isOpen, setOpen] = useState(false);
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [formData, setFormData] = useState<CinemaData>({
    name: "",
    description: "",
    city: "",
    hotline: "",
    address: "",
    longitude: 0,
    latitude: 0,
    listImage: [""],
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          const map = new google.maps.Map(mapElement, {
            center: { lat: 16.07, lng: 108.15 },
            zoom: 13,
          });

          const marker = new google.maps.Marker({
            map: map,
            draggable: true,
          });

          marker.addListener("dragend", function () {
            // Get the marker's new latitude and longitude.
            const latLng = marker.getPosition();

            // Log the new latitude and longitude.
            if (latLng) {
              console.log("Marker was dragged to:", latLng.lat(), latLng.lng());
              setFormData((prevFormData) => ({
                ...prevFormData,
                longitude: latLng.lng(),
                latitude: latLng.lat(),
              }));
            }
          });

          let autocompleteInput = document.getElementById("autocomplete-input");
          let autocomplete = new google.maps.places.Autocomplete(
            autocompleteInput as HTMLInputElement
          );

          // Add a listener to the PlaceAutocomplete object.
          autocomplete.addListener("place_changed", function () {
            // Get the place that the user selected.
            const place = autocomplete.getPlace();

            // Set the marker's position to the selected place's latitude and longitude.
            if (place.geometry) {
              marker.setPosition(place.geometry.location);
              map.setCenter(place.geometry.location);
            }

            map.setZoom(14);
            // Get the marker's new latitude and longitude.
            const latLng = marker.getPosition();

            if (latLng) {
              console.log("Marker was init to:", latLng.lat(), latLng.lng());
              setFormData((prevFormData) => ({
                ...prevFormData,
                longitude: latLng.lng(),
                latitude: latLng.lat(),
              }));
            }
            if (inputRef.current) {
              if (place.formatted_address) {
                inputRef.current.value = place.formatted_address;
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  address: place.formatted_address,
                }));
              }
            }
          });
        }
      }, 0);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  };

  const customAfter = (event: any) => {
    const file = event.target.files[0];
    file.objectURL = URL.createObjectURL(event.target.files[0]);
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
    e.preventDefault();
    if (uploadImages.length === 0) {
      toast.error("Please select images.");
      return;
    }
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

    const uploadPromises = uploadImages.map(async (img: any) => {
      const image = new FormData();
      image.append("filePath", "Cinema");
      image.append("file", img);
      console.log("formData" + image.get("filePath"));

      const response = await apiClient.post(`/upload`, image);

      const result = await response.data;
      console.log(result);
      return result.data.filePath;
    });

    Promise.all(uploadPromises)
      .then(async (uploadedImages) => {
        console.log("upload promise res: ", uploadImages);
        formData.listImage = uploadedImages;
        const response = await apiClient.post(
          `/cinema`,
          JSON.stringify({ ...formData })
        );
        return response.data;
      })
      .then((result) => {
        handleRefetch();
        setOpen(false);
        setFormData({
          name: "",
          description: "",
          city: "",
          hotline: "",
          longitude: 108,
          latitude: 16,
          address: "",
          listImage: [""],
        });
        toast.success("Add cinema successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  const clickHandler = () => {
    setOpen(true);
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={clickHandler}>
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
                <Label>Description</Label>
                <TextInput
                  name="description"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Hotline</Label>
                <TextInput
                  name="hotline"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>City</Label>
                <TextInput
                  name="city"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Address</Label>
                <TextInput
                  ref={inputRef}
                  id="autocomplete-input"
                  placeholder="Search for an address"
                />
              </div>
              <div className="lg:col-span-2">
                <div id="map"></div>
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

const EditProductModal: React.FC<{
  data: CinemaData | undefined;
  handleRefetch: () => void;
}> = ({ data, handleRefetch }) => {
  const [isEditImage, setIsEditImage] = useState<boolean>(false);
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [apiImages, setApiImages] = useState<string[]>();
  const [isOpen, setOpen] = useState(false);

  const [formData, setFormData] = useState<CinemaData>({
    id: data?.id,
    name: data?.name,
    description: data?.description,
    city: data?.city,
    hotline: data?.hotline,
    address: data?.address,
    longitude: data?.longitude,
    latitude: data?.latitude,
    listImage: data?.listImage,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    e.preventDefault();
    console.log(formData);
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

    if (isEditImage) {
      if (uploadImages.length == 0) {
        toast.error("Please select images");
        return;
      }

      const uploadPromises = uploadImages.map(async (img: any) => {
        const image = new FormData();
        image.append("filePath", "Cinema");
        image.append("file", img);
        console.log("formData" + image.get("filePath"));

        const response = await apiClient.post(`/upload`, image);

        const result = await response.data;
        console.log(result);
        return result.data.filePath;
      });

      Promise.all(uploadPromises)
        .then(async (uploadedImages) => {
          const response = await apiClient.put(
            `/cinema`,
            JSON.stringify({ ...formData, listImage: uploadedImages })
          );

          return response.data;
        })
        .then((result) => {
          setOpen(false);
          handleRefetch();
          toast.success("Edit film successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.messages[0]);
        });
    } else {
      apiClient
        .put(`/cinema`, JSON.stringify(formData))
        .then((response) => {
          setOpen(false);
          handleRefetch();
          toast.success("Edit cinema successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.messages[0]);
        });
    }
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
  handleRefetch: () => void;
}> = ({ cinemaId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/cinema?Id=${cinemaId}`)

      .then((response) => {
        handleRefetch();
        toast.success("Delete cinema successfully");
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
  handleRefetch: () => void;
}> = ({ cinemaApiResponse, handleRefetch }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Address</Table.HeadCell>
        <Table.HeadCell>City</Table.HeadCell>
        <Table.HeadCell>Hotline</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {cinemaApiResponse?.data &&
          cinemaApiResponse.data.map((data) => (
            <CinemaRow
              data={data}
              key={data.id}
              handleRefetch={handleRefetch}
            />
          ))}
      </Table.Body>
    </Table>
  );
};

const CinemaRow: React.FC<{
  data: CinemaData | undefined;
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
        {data?.address}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.city}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.hotline}
      </Table.Cell>

      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          <EditProductModal data={data} handleRefetch={handleRefetch} />
          <DeleteProductModal
            cinemaId={data?.id}
            handleRefetch={handleRefetch}
          />
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
