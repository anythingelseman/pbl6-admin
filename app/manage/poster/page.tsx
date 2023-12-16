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
  Spinner,
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
import toast from "react-hot-toast";

const apiUrl = process.env.API_URL;
interface PosterData {
  id?: number;
  pathImage: string,
  linkUrl?: string,
  createdOn?: string; // This should be a valid date string format
  lastModifiedOn?: string; // This should be a valid date string format
}

interface PosterApiResponse {
  messages: string[];
  succeeded: boolean;
  data: PosterData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// interface CategoryData {
//   id: number;
//   name: string;
//   createdOn: string;
//   lastModifiedOn: string | null;
// }

// interface CategoryApiResponse {
//   data: CategoryData[];
//   currentPage: number;
//   totalPages: number;
//   totalCount: number;
//   pageSize: number;
//   hasPreviousPage: boolean;
//   hasNextPage: boolean;
//   messages: any[]; // Assuming this can be of any type, change it as per actual data structure
//   succeeded: boolean;
// }

interface PaginationComponentProps {
  posterApiResponse: PosterApiResponse | undefined;
  currentSearched: string;
  setPosterApiResponse: React.Dispatch<
    React.SetStateAction<PosterApiResponse | undefined>
  >;
}

export default function PostersPage() {
  const [posterApiResponse, setPosterApiResponse] = useState<PosterApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response1 = await apiClient.get<PosterApiResponse | undefined>(
        `/Poster?OrderBy=id`
      );
      setPosterApiResponse(response1.data);
      setIsLoading(false);
      setCurrentSearched("");
      setSearchTerm("");
    };
    fetchData();
  }, [refetchTrigger]);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };

  const searchHandle = async () => {
    try {
      setCurrentSearched(searchTerm);
      const response = await apiClient.get<PosterApiResponse | undefined>(
        `/Poster?Keyword=${searchTerm}&OrderBy=id`
      );
      setPosterApiResponse(response.data);
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
              Films
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="flex w-full items-center sm:justify-end">
              <AddPosterModal
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
              <PosterTable
                posterApiResponse={posterApiResponse}
                handleRefetch={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        posterApiResponse={posterApiResponse}
        currentSearched={currentSearched}
        setPosterApiResponse={setPosterApiResponse}
      />
    </>
  );
}

const AddPosterModal: React.FC<{
  handleRefetch: () => void;
}> = ({handleRefetch }) => {
  const initialValue = {
    pathImage: "",
    linkUrl: "",
  };
  const [isOpen, setOpen] = useState(false);
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [formData, setFormData] = useState<PosterData>(initialValue);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    console.log(formData);
    if (uploadImages.length === 0) {
      toast.error("Please select images.");
      return;
    }

    setOpen(false);

    const uploadPromises = uploadImages.map(async (img: any) => {
      const image = new FormData();
      image.append("filePath", 'Poster');
      image.append("file", img);
      console.log("formData" + image.get("filePath"));

      const response = await apiClient.post(`/upload`, image);

      const result = await response.data;
      console.log(result);
      return result.data.filePath;
    });

    Promise.race(uploadPromises)
      .then(async (uploadedImages) => {
        console.log('upload promise res: ',uploadImages);
        formData.pathImage = uploadedImages;
        const response = await apiClient.post(
          `/Poster`,
          JSON.stringify({ ...formData})
        );
        return response.data;
      })
      .then((result) => {
        handleRefetch();
        setFormData(initialValue);
        toast.success("Add Poster successfully");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
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
                <Label>Link Url</Label>
                <TextInput
                  name="linkUrl"
                  className="mt-1"
                  onChange={handleChange}
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
  posterId: number | undefined;
  handleRefetch: () => void;
}> = ({ posterId, handleRefetch }) => {
  const [isEditImage, setIsEditImage] = useState<boolean>(false);
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [apiImages, setApiImages] = useState<string[]>();
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<PosterData>({
    linkUrl: "",
    pathImage: "",
  });

  const fetchData = async () => {
    const response = await apiClient.get(`/Poster/${posterId}`);
    const data = await response.data.data;
    setApiImages(data.image);

    const transformedArray = data.image.map((link: string) => {
      const parts = link.split("/");
      const fileName = parts[parts.length - 1];

      return {
        nameFile: fileName,
        typeFile: "Image",
      };
    });

    setFormData({
      id: data.id,
      linkUrl: data.linkUrl,
      pathImage: data.pathImage,
    });
    console.log(formData);
  };


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

    if (isEditImage) {
      if (uploadImages.length == 0) {
        toast.error("Please select images");
        return;
      }

      const uploadPromises = uploadImages.map(async (img: any) => {
        const image = new FormData();
        image.append("filePath", img.name);
        image.append("file", img);
        console.log("formData" + image.get("filePath"));

        const response = await apiClient.post(`/upload`, image);

        const result = await response.data;
        console.log(result);
        return {
          nameFile: result.data.filePath,
          typeFile: "Image",
        };
      });

      Promise.all(uploadPromises)
        .then(async (uploadedImages) => {
          const response = await apiClient.put(
            `/film`,
            JSON.stringify({ ...formData, fileImages: uploadedImages })
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
        .put(`/film`, JSON.stringify(formData))
        .then((response) => {
          setOpen(false);
          handleRefetch();
          toast.success("Edit film successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.messages[0]);
        });
    }
  };

  return (
    <>
      <Button
        className="bg-sky-600"
        onClick={() => {
          setOpen(!isOpen);
          fetchData();
        }}
      >
        <HiPencilAlt className="mr-2 text-lg" />
        Edit
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 ">
          <strong>Edit film</strong>
        </Modal.Header>
        {formData && (
          <form onSubmit={handleSubmit} className="bg-white">
            <Modal.Body>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <Label>Link url</Label>
                  <Textarea
                    name="description"
                    rows={6}
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.linkUrl}
                  />
                </div>

                {!isEditImage && (
                  <div className="lg:col-span-2">
                    <Label className="mb-5">Image</Label>
                    <div className="flex gap-x-3">
                      {apiImages?.map((imageLink, index) => (
                        <img
                          key={index}
                          src={imageLink}
                          alt={`Image ${index + 1}`}
                          width={150}
                          height={100}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {!isEditImage && (
                  <Button
                    className="bg-sky-600"
                    onClick={() => setIsEditImage(true)}
                  >
                    <HiPencilAlt className="mr-2 text-lg" />
                    Edit image
                  </Button>
                )}

                {isEditImage && (
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
                                height={100}
                                width={150}
                              />
                              <span
                                className=""
                                onClick={(e) => {
                                  let images = uploadImages.filter(
                                    (el: any) => {
                                      if (el.name !== img.name) return el;
                                    }
                                  );
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
                )}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button className="bg-sky-600" type="submit">
                Edit
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </>
  );
};

const DeleteProductModal: React.FC<{
  posterId: number | undefined;
  handleRefetch: () => void;
}> = ({ posterId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/Poster?Id=${posterId}`)
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
              Are you sure you want to delete this film?
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

const PosterTable: React.FC<{
  posterApiResponse: PosterApiResponse | undefined;
  handleRefetch: () => void;
}> = ({ posterApiResponse, handleRefetch }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Link Url</Table.HeadCell>
        <Table.HeadCell>Image</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {posterApiResponse?.data &&
          posterApiResponse.data.map((data) => (
            <PosterRow
              data={data}
              key={data.id}
              handleRefetch={handleRefetch}
            />
          ))}
      </Table.Body>
    </Table>
  );
};

const PosterRow: React.FC<{
  data: PosterData | undefined;
  handleRefetch: () => void;
}> = ({ data, handleRefetch }) => {

  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
        <div className="text-base font-semibold text-gray-900 dark:text-white">
          {data?.linkUrl}
        </div>
        <div className="text-sm font-normal text-gray-500 "></div>
      </Table.Cell>
      {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        <div className="w-[200px] overflow-hidden text-ellipsis whitespace-pre-line">
          {data?.description}
        </div>
      </Table.Cell> */}
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        <img src={data?.pathImage} />
      </Table.Cell>
      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          {/* <EditProductModal
            posterId={data?.id}
            handleRefetch={handleRefetch}
          /> */}
          <DeleteProductModal posterId={data?.id} handleRefetch={handleRefetch} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

const Pagination: React.FC<PaginationComponentProps> = ({
  posterApiResponse,
  currentSearched,
  setPosterApiResponse,
}) => {
  const NextPageHandle = async () => {
    try {
      if (!posterApiResponse) return;
      const response = await apiClient.get<PosterApiResponse | undefined>(
        `/Poster?Keyword=${currentSearched}&PageNumber=${
          posterApiResponse?.currentPage + 1
        }&OrderBy=id`
      );
      setPosterApiResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!posterApiResponse) return;
      const response = await apiClient.get(
        `/Poster?Keyword=${currentSearched}&PageNumber=${
          posterApiResponse?.currentPage - 1
        }&OrderBy=id`
      );
      const data = response.data;
      setPosterApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={!posterApiResponse?.hasPreviousPage}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          posterApiResponse?.hasPreviousPage
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
            {posterApiResponse?.currentPage}
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {posterApiResponse?.totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={!posterApiResponse?.hasNextPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${
          posterApiResponse?.hasNextPage
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
