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
  poster?: string;
  enable?: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response1 = await apiClient.get<FilmApiResponse | undefined>(
        `/film?OrderBy=id`,
      );
      setFilmApiResponse(response1.data);

      const response2 = await apiClient.get<CategoryApiResponse | undefined>(
        `/category?PageSize=50&OrderBy=id`,
      );
      setCategoryApiResponse(response2.data);
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
      const response = await apiClient.get<FilmApiResponse | undefined>(
        `/film?Keyword=${searchTerm}&OrderBy=id`,
      );
      setFilmApiResponse(response.data);
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
              Phim
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="mb-4 sm:mb-0 sm:pr-3 ">
              <Label htmlFor="search" className="sr-only">
                Tìm kiếm
              </Label>
              <div className="relative mt-1 flex gap-x-3">
                <TextInput
                  className="w-[400px]"
                  id="search"
                  name="search"
                  placeholder="Tìm kiếm theo tên "
                  value={searchTerm}
                  onChange={changeHandle}
                />
                <Button className="bg-sky-600 w-[100px]" onClick={searchHandle}>
                  Tìm kiếm
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal
                categoryData={CategoryApiResponse?.data}
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
              <FilmTable
                filmApiResponse={filmApiResponse}
                categoryData={CategoryApiResponse?.data}
                handleRefetch={handleRefetch}
              />
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
  handleRefetch: () => void;
}> = ({ categoryData, handleRefetch }) => {
  const initialValue = {
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
    poster: "a",
  };
  const [isOpen, setOpen] = useState(false);
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [formData, setFormData] = useState<FilmData>(initialValue);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (categoryId: number) => {
    setFormData((prevState) => {
      const isSelected = prevState.listIdCategory?.includes(categoryId);
      return {
        ...prevState,
        listIdCategory: isSelected
          ? prevState.listIdCategory?.filter((id) => id !== categoryId)
          : [...prevState.listIdCategory, categoryId],
      };
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
      toast.error("Làm ơn chọn ảnh.");
      return;
    }

    if (formData.startDate === "" || formData.endDate === "") {
      toast.error("Làm ơn chọn ngày.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    if (
      Object.values(formData).some(
        (value) =>
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" &&
            (value === null || value === undefined || value === 0)),
      )
    ) {
      toast.error("Hãy điền đầy đủ thông tin.");
      return;
    }

    setOpen(false);

    const uploadPromises = uploadImages.map(async (img: any) => {
      const image = new FormData();
      image.append("filePath", "Film");
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
        const response = await apiClient.post(
          `/film`,
          JSON.stringify({ ...formData, fileImages: uploadedImages }),
        );
        return response.data;
      })
      .then((result) => {
        handleRefetch();
        setFormData(initialValue);
        toast.success("Thêm phim thành công");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Thêm phim
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm phim</strong>
        </Modal.Header>
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label>Tên phim</Label>
                <TextInput
                  name="name"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Diễn viên</Label>
                <TextInput
                  name="actor"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Đạo diễn</Label>
                <TextInput
                  name="director"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Nhà sản xuất</Label>
                <TextInput
                  name="producer"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Thời lượng (phút)</Label>
                <TextInput
                  type="number"
                  name="duration"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Quốc gia</Label>
                <TextInput
                  name="country"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Năm</Label>
                <TextInput
                  type="number"
                  name="year"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Độ tuổi giới hạn</Label>
                <TextInput
                  type="number"
                  name="limitAge"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Ngày bắt đầu : </Label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="rounded"
                />
              </div>

              <div>
                <Label>Ngày kết thúc : </Label>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  className="rounded"
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Thể loại</Label>
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
                <Label>Nội dung phim</Label>
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
                        Tải ảnh tại đây
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
                    },
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button className="bg-sky-600" type="submit">
              Thêm
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

const EditProductModal: React.FC<{
  filmId: number | undefined;
  categoryData: CategoryData[] | undefined;
  handleRefetch: () => void;
}> = ({ filmId, categoryData, handleRefetch }) => {
  const getCategoryIds = (categoryNames: string | undefined): number[] => {
    const namesArray = categoryNames?.split(",").map((name) => name.trim());

    const categoryIds = namesArray?.map((name) => {
      const category = categoryData?.find((c) => c.name === name);
      return category ? category.id : null;
    });

    // Filter out null values (categories not found)
    return categoryIds?.filter((id) => id !== null) as number[];
  };
  const [isEditImage, setIsEditImage] = useState<boolean>(false);
  const [uploadImages, setUploadImages] = useState<any>([]);
  const [apiImages, setApiImages] = useState<string[]>();
  const [isOpen, setOpen] = useState(false);
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
    poster: "a",
  });

  const fetchData = async () => {
    const response = await apiClient.get(`/film/${filmId}`);
    const data = await response.data.data;
    setApiImages(data.image);

    const transformedArray = data.image.map((link: string) => {
      const url = new URL(link);
      const pathname = url.pathname;
      const fileName = pathname.startsWith("/")
        ? pathname.substring(1)
        : pathname;

      return {
        nameFile: fileName,
        typeFile: "Image",
      };
    });

    setFormData({
      id: data.id,
      name: data.name,
      actor: data.actor,
      director: data.director,
      producer: data.producer,
      duration: data.duration,
      description: data.description,
      year: data.year,
      country: data.country,
      limitAge: data.limitAge,
      trailer: data.trailer,
      startDate: data.startDate,
      endDate: data.endDate,
      listIdCategory: getCategoryIds(data.category),
      fileImages: transformedArray,
      poster: "a",
    });
    console.log(formData);
  };

  const handleCheckboxChange = (categoryId: number) => {
    setFormData((prevState) => {
      const isSelected = prevState.listIdCategory?.includes(categoryId);
      return {
        ...prevState,
        listIdCategory: isSelected
          ? prevState.listIdCategory?.filter((id) => id !== categoryId)
          : [...prevState.listIdCategory, categoryId],
      };
    });
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    if (
      Object.values(formData).some(
        (value) =>
          (typeof value === "string" && value.trim() === "") ||
          (typeof value === "number" &&
            (value === null || value === undefined || value === 0)),
      )
    ) {
      toast.error("Hãy điền đầy đủ thông tin");
      return;
    }

    if (formData.startDate === "" || formData.endDate === "") {
      toast.error("Làm ơn chọn ngày.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    if (isEditImage) {
      if (uploadImages.length == 0) {
        toast.error("Làm ơn chọn ảnh.");
        return;
      }

      const startDate = new Date(formData.startDate);
      const uploadPromises = uploadImages.map(async (img: any) => {
        const image = new FormData();
        image.append("filePath", "Film");
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
            JSON.stringify({ ...formData, fileImages: uploadedImages }),
          );

          return response.data;
        })
        .then((result) => {
          setOpen(false);
          handleRefetch();
          toast.success("Sửa phim thành công");
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
          toast.success("Sửa phim thành công");
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
        Sửa
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 ">
          <strong>Chỉnh sửa phim</strong>
        </Modal.Header>
        {formData.name && (
          <form onSubmit={handleSubmit} className="bg-white">
            <Modal.Body>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label>Tên phim</Label>
                  <TextInput
                    name="name"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>
                <div>
                  <Label>Diễn viên</Label>
                  <TextInput
                    name="actor"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.actor}
                  />
                </div>
                <div>
                  <Label>Đạo diễn</Label>
                  <TextInput
                    name="director"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.director}
                  />
                </div>
                <div>
                  <Label>Nhà sản xuất</Label>
                  <TextInput
                    name="producer"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.producer}
                  />
                </div>
                <div>
                  <Label>Thời lượng (phút)</Label>
                  <TextInput
                    type="number"
                    name="duration"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.duration}
                  />
                </div>

                <div>
                  <Label>Quốc gia</Label>
                  <TextInput
                    name="country"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.country}
                  />
                </div>

                <div>
                  <Label>Năm</Label>
                  <TextInput
                    type="number"
                    name="year"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.year}
                  />
                </div>

                <div>
                  <Label>Giới hạn tuổi</Label>
                  <TextInput
                    type="number"
                    name="limitAge"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.limitAge}
                  />
                </div>

                <div>
                  <Label>Ngày khởi chiếu :</Label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleChange}
                    className="rounded"
                    value={
                      new Date(formData.startDate).toISOString().split("T")[0]
                    }
                  />
                </div>

                <div>
                  <Label>Ngày kết thúc :</Label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleChange}
                    className="rounded"
                    value={
                      new Date(formData.endDate).toISOString().split("T")[0]
                    }
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Thể loại</Label>
                </div>

                {categoryData &&
                  categoryData.map((data) => (
                    <div key={data.id}>
                      <Checkbox
                        className="mx-3"
                        name="listIdCategory"
                        id={data.id.toString()}
                        onChange={() => handleCheckboxChange(data.id)}
                        checked={formData.listIdCategory.includes(data.id)}
                      />
                      <Label htmlFor={data.id.toString()}>{data.name}</Label>
                    </div>
                  ))}

                <div className="lg:col-span-2">
                  <Label>Nội dung phim </Label>
                  <Textarea
                    name="description"
                    rows={6}
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.description}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label>Trailer</Label>
                  <TextInput
                    onChange={handleChange}
                    name="trailer"
                    className="mt-1"
                    value={formData.trailer}
                  />
                </div>

                {!isEditImage && (
                  <div className="lg:col-span-2">
                    <Label className="mb-5">Ảnh</Label>
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
                    Chỉnh sửa ảnh
                  </Button>
                )}

                {isEditImage && (
                  <div className="lg:col-span-2">
                    <div className="flex w-full items-center justify-center">
                      <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <HiUpload className="text-4xl text-gray-300" />
                          <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                            Tải ảnh ở đây
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
                                    },
                                  );
                                  setUploadImages([...images]);
                                }}
                              >
                                &times;
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button className="bg-sky-600" type="submit">
                Sửa
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </>
  );
};

const EnableProductModal: React.FC<{
  enableStatus: boolean;
  filmId: number | undefined;
  handleRefetch: () => void;
}> = ({ enableStatus, filmId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const enableHandle = () => {
    setOpen(false);
    apiClient
      .patch(`/film/enable?FilmId=${filmId}`)
      .then((response) => {
        handleRefetch();
        toast.success(
          `${enableStatus === true ? "Ẩn" : "Hiện"} phim thành công`
        );
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button className="bg-orange-500" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        {`${enableStatus === true ? "Ẩn" : "Hiện"} phim`}
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0 text-center">
          <span>{`${enableStatus === true ? "Ẩn" : "Hiện"} phim`}</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              {`Bạn có muốn ${
                enableStatus === true ? "ẩn" : "hiện"
              } phim này không ?`}
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={enableHandle}>
                Có
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const DeleteProductModal: React.FC<{
  filmId: number | undefined;
  handleRefetch: () => void;
}> = ({ filmId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/film?Id=${filmId}`)
      .then((response) => {
        handleRefetch();
        toast.success("Xóa phim thành công");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Xóa
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0 text-center">
          <span>Xóa phim</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Bạn có muốn xóa phim này không ?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={deleteHandle}>
                Có
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Không
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
  categoryData: CategoryData[] | undefined;
  handleRefetch: () => void;
}> = ({ filmApiResponse, categoryData, handleRefetch }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Tên</Table.HeadCell>
        <Table.HeadCell>Ảnh</Table.HeadCell>
        <Table.HeadCell>Diễn viên</Table.HeadCell>
        <Table.HeadCell>Đạo diễn</Table.HeadCell>
        <Table.HeadCell>Thời lượng</Table.HeadCell>
        {/* <Table.HeadCell>Description</Table.HeadCell> */}
        <Table.HeadCell>Năm</Table.HeadCell>
        <Table.HeadCell>Quốc gia</Table.HeadCell>
        <Table.HeadCell>Giới hạn tuổi</Table.HeadCell>
        <Table.HeadCell>Trailer</Table.HeadCell>
        <Table.HeadCell>Ngày khởi chiếu</Table.HeadCell>
        <Table.HeadCell>Ngày kết thúc</Table.HeadCell>
        <Table.HeadCell>Thể loại</Table.HeadCell>
        <Table.HeadCell>Trạng thái</Table.HeadCell>
        <Table.HeadCell>Các thao tác</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {filmApiResponse?.data &&
          filmApiResponse.data.map((data) => (
            <FilmRow
              data={data}
              key={data.id}
              categoryData={categoryData}
              handleRefetch={handleRefetch}
            />
          ))}
      </Table.Body>
    </Table>
  );
};

const FilmRow: React.FC<{
  data: FilmData | undefined;
  categoryData: CategoryData[] | undefined;
  handleRefetch: () => void;
}> = ({ data, categoryData, handleRefetch }) => {
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
        <div className="text-base font-semibold text-gray-900">
          {data?.name}
        </div>
        <div className="text-sm font-normal text-gray-500 "></div>
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        <img src={data?.image} />
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
      {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        <div className="w-[200px] overflow-hidden text-ellipsis whitespace-pre-line">
          {data?.description}
        </div>
      </Table.Cell> */}
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
        {data?.enable === true ? "Hiện" : "Ẩn"}
      </Table.Cell>
      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          <EditProductModal
            filmId={data?.id}
            categoryData={categoryData}
            handleRefetch={handleRefetch}
          />
          <DeleteProductModal filmId={data?.id} handleRefetch={handleRefetch} />
          <EnableProductModal
            filmId={data?.id}
            handleRefetch={handleRefetch}
            enableStatus={data?.enable!}
          />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

const Pagination: React.FC<PaginationComponentProps> = ({
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
        }&OrderBy=id`,
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
        }&OrderBy=id`,
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
        <span>Trang trước </span>
      </button>

      <div>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Trang&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {filmApiResponse?.currentPage}
          </span>
          &nbsp;trên&nbsp;
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
        <span>Trang sau</span>
        <HiChevronRight className="text-2xl" />
      </button>
    </div>
  );
};
