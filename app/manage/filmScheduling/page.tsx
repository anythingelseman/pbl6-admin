"use client";

import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
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
import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import apiClient from "@/services/apiClient";
import { EventSourceInput } from "@fullcalendar/core";
import toast from "react-hot-toast";
import { ModalFooter } from "flowbite-react/lib/esm/components/Modal/ModalFooter";
import { useUser } from "@/app/hooks/useUser";

interface TSeat {
  id: number;
  numberSeat: number;
  seatCode: string;
  status: number;
}

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
  enable: boolean;
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

interface ScheduleApiResponse {
  data: ScheduleItem[];
}

interface ScheduleItem {
  id?: number;
  duration: number;
  description: string;
  startTime?: string;
  endTime?: string;
  film?: string;
  room?: string;
  price: number;
  filmId?: number;
  roomId?: number;
  startTimes?: any;
}

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

export default function SchedulingPage() {
  const [cinemaApiResponse, setCinemaApiResponse] =
    useState<CinemaApiResponse>();
  const [scheduleApiResponse, setScheduleApiResponse] =
    useState<ScheduleApiResponse>();
  const [roomApiResponse, setRoomApiResponse] = useState<RoomApiResponse>();
  const [filmApiResponse, setFilmApiResponse] = useState<FilmApiResponse>();
  const [currentRooms, setCurrentRooms] = useState<RoomData[]>();
  const [cinemaId, setCinemaId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingSchedule, setIsFetchingSchedule] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response1 = await apiClient.get<FilmApiResponse | undefined>(
        `/film?IsExport=true&OrderBy=id`
      );
      setFilmApiResponse(response1.data);

      const response2 = await apiClient.get(`/Room?IsExport=true&OrderBy=id`);
      const data2 = response2.data;
      setRoomApiResponse(data2);

      const response3 = await apiClient.get<CinemaApiResponse | undefined>(
        `/cinema?IsExport=true&OrderBy=id`
      );
      const data3 = response3.data;
      setCinemaApiResponse(data3);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  function getRoomsByCinemaId(
    rooms: RoomData[] | undefined,
    targetCinemaId: number
  ): RoomData[] | undefined {
    return rooms?.filter((room) => room.cinemaId === targetCinemaId);
  }

  const changeHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCinemaId(Number(e.target.value));
  };

  const searchHandle = async () => {
    try {
      setIsFetchingSchedule(true);
      const response = await apiClient.get(`/schedule/cinema/${cinemaId}`);
      const data = response.data;
      setScheduleApiResponse(data);
      setCurrentRooms(getRoomsByCinemaId(roomApiResponse?.data, cinemaId));
      setIsFetchingSchedule(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function getCinemaNameById(cinemaId: number): string {
    const foundCinema = cinemaApiResponse?.data?.find(
      (cinema) => cinema.id === cinemaId
    );
    return foundCinema?.name || "";
  }

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
              Lịch chiếu phim
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="mb-4 sm:mb-0 sm:pr-3 ">
              <Label htmlFor="search" className="sr-only">
                Tìm kiếm lịch
              </Label>
              <div className="relative mt-1 flex gap-x-3 w-[600px]">
                <Select name="cinemaId" required onChange={changeHandle}>
                  {cinemaApiResponse?.data?.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </option>
                  ))}
                </Select>
                <Button className="bg-sky-600 w-[175px]" onClick={searchHandle}>
                  Tìm kiếm lịch
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center sm:justify-end">
              <AddScheduleModal
                filmApiResponse={filmApiResponse}
                cinemaName={getCinemaNameById(cinemaId)}
                currentRooms={currentRooms}
                refetchHandle={searchHandle}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {isFetchingSchedule && (
                <div className="flex justify-center content-center min-h-screen">
                  <Spinner className="mt-60" />
                </div>
              )}
              {scheduleApiResponse && !isFetchingSchedule && (
                <ScheduleTable
                  refetchHandle={searchHandle}
                  scheduleApiResponse={scheduleApiResponse}
                  currentRooms={currentRooms}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const AddScheduleModal: React.FC<{
  filmApiResponse: FilmApiResponse | undefined;
  cinemaName: string;
  currentRooms: RoomData[] | undefined;
  refetchHandle: () => void;
}> = ({ filmApiResponse, cinemaName, currentRooms, refetchHandle }) => {
  const [startTimes, setStartTimes] = useState([{ id: 1, value: "" }]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<ScheduleItem>({
    duration: 0,
    description: "",
    startTimes: [],
    filmId: 0,
    roomId: 0,
    price: 0,
  });

  const addStartTime = () => {
    setStartTimes([...startTimes, { id: startTimes.length + 1, value: "" }]);
  };

  const removeStartTime = (id: number) => {
    setStartTimes(startTimes.filter((time) => time.id !== id));
  };

  const handleTimeChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartTimes = startTimes.map((time) =>
      time.id === id ? { ...time, value: event.target.value } : time
    );
    setStartTimes(newStartTimes);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue;
    if (name === "description") updatedValue = value;
    else if (name === "startTime") updatedValue = value;
    else updatedValue = Number(value);
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = hours * 60 + minutes;
    if (duration <= 0) {
      toast.error("Thời gian không hợp lệ");
      return;
    }

    if (
      startTimes.length === 0 ||
      startTimes.some((time) => time.value.trim() === "")
    ) {
      toast.error("Thời gian bắt đầu không hợp lệ");
      return;
    }

    const timesOnly = startTimes.map((time) => time.value);

    const newFormData = {
      ...formData,
      duration: duration,
      startTimes: timesOnly,
    };

    setFormData(newFormData);

    if (
      Object.values(newFormData).some(
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
      .post(`/schedule/muli-time-slots`, JSON.stringify(newFormData))
      .then((response) => {
        refetchHandle();
        setOpen(false);
        setFormData({
          duration: 0,
          description: "",
          startTimes: "",
          filmId: 0,
          roomId: 0,
          price: 0,
        });
        setStartTimes([{ id: 1, value: "" }]);
        toast.success("Thêm lịch thành công");
      })
      .catch((error: any) => {
        toast.error(error.response.data.messages[0]);
      });
  };
  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Thêm lịch vào rạp
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
            <div className="mb-3">
              <Label>Phim</Label>
              <Select name="filmId" onChange={handleChange} required>
                <option selected value="">
                  Chọn phim
                </option>
                {filmApiResponse?.data
                  .filter((film) => film.enable)
                  .map((film) => (
                    <option key={film.id} value={film.id}>
                      {film.name}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="mb-3">
              <Label>Thời gian</Label>
              <div className="flex gap-x-3 mt-1">
                <TextInput
                  className="w-[100px]"
                  type="number"
                  min="0"
                  placeholder="Giờ"
                  onChange={(e) => setHours(parseInt(e.target.value))}
                />
                <TextInput
                  className="w-[100px]"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Phút"
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="mb-3">
              <Label>Mô tả</Label>
              <TextInput
                name="description"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Label>Giờ bắt đầu</Label>
              <br />
              {startTimes.map((time) => (
                <div key={time.id}>
                  <input
                    type="datetime-local"
                    value={time.value}
                    onChange={(event) => handleTimeChange(time.id, event)}
                    className="rounded my-3"
                    name="startTime"
                  />
                  <button
                    className="mx-5 text-red-500"
                    onClick={() => removeStartTime(time.id)}
                  >
                    X
                  </button>
                </div>
              ))}
              <Button className="bg-sky-600 mt-3" onClick={addStartTime}>
                Thêm giờ
              </Button>
            </div>
            <div className="mb-3">
              <Label>Rạp</Label>
              <TextInput className="mt-1" value={cinemaName} disabled />
            </div>
            <div className="mb-3">
              <Label>Phòng</Label>
              <Select name="roomId" onChange={handleChange} required>
                <option selected value="">
                  Chọn phòng
                </option>
                {currentRooms?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              <Label>Giá vé (VND)</Label>
              <TextInput
                name="price"
                className="mt-1"
                onChange={handleChange}
                type="number"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-sky-600" type="submit">
              Thêm lịch
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

const ScheduleTable: React.FC<{
  scheduleApiResponse: ScheduleApiResponse | undefined;
  currentRooms: RoomData[] | undefined;
  refetchHandle: () => void;
}> = ({ scheduleApiResponse, currentRooms, refetchHandle }) => {
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const [scheduleSeats, setScheduleSeats] = useState<any[]>([]);
  const calendarRef = useRef(null);

  const handleEventClick = async (info: any) => {
    setSelectedSchedule(getScheduleById(Number(info.event._def.publicId)));
    const response = await apiClient.get(
      `/schedule/${Number(info.event._def.publicId)}`
    );
    setScheduleSeats(response.data.data.scheduleSeats);
  };

  const resources = currentRooms?.map((room) => ({
    id: room.id || 0,
    title: room.name,
  }));

  const handleCloseModal = () => {
    setSelectedSchedule(null);
  };

  function getRoomByName(
    rooms: RoomData[] | undefined,
    targetRoomName: string | undefined
  ): RoomData | null {
    const foundRoom = rooms?.find((room) => room.name === targetRoomName);

    // If a room with the specified name is found, return its ID; otherwise, return null
    return foundRoom ? foundRoom || null : null;
  }

  function getScheduleById(scheduleId: number): ScheduleItem | null {
    const foundSchedule = scheduleApiResponse?.data?.find(
      (schedule) => schedule.id === scheduleId
    );
    return foundSchedule || null;
  }

  const events = scheduleApiResponse?.data.map((schedule) => ({
    id: schedule.id,
    title: schedule.film,
    start: schedule.startTime,
    end: schedule.endTime,
    resourceId: getRoomByName(currentRooms, schedule.room)?.id,
  }));

  const deleteHandle = () => {
    handleCloseModal();
    apiClient
      .delete(`/schedule?Id=${selectedSchedule?.id}`)
      .then((response) => {
        refetchHandle();
        toast.success("Xóa lịch thành công");
      })
      .catch((error) => {
        toast.error(error.response.data.messages[0]);
      });
  };

  const refetchSeats = async () => {
    const response = await apiClient.get(`/schedule/${selectedSchedule?.id}`);
    setScheduleSeats(response.data.data.scheduleSeats);
  };

  const handleChange = () => {};

  return (
    <>
      <FullCalendar
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        ref={calendarRef}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "resourceTimelineDay",
        }}
        initialView="resourceTimelineDay"
        nowIndicator={true}
        selectable={true}
        selectMirror={true}
        events={events as EventSourceInput | undefined}
        resourceAreaHeaderContent="Rooms"
        //@ts-ignore
        resources={resources}
      />
      <Modal show={!!selectedSchedule} onClose={handleCloseModal}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Chi tiết</strong>
        </Modal.Header>
        <form className="bg-white">
          <Modal.Body>
            <div>
              <Label>Phim</Label>
              <TextInput
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.film}
                disabled
              />
            </div>
            <div>
              <Label>Thời gian (phút)</Label>
              <TextInput
                type="number"
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.duration}
                disabled
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="price">Giờ bắt đầu: </Label>
              <br />
              <input
                type="datetime-local"
                onChange={handleChange}
                className="rounded"
                value={selectedSchedule?.startTime}
                disabled
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="price">Giờ kết thúc: </Label>
              <br />
              <input
                type="datetime-local"
                onChange={handleChange}
                className="rounded"
                value={selectedSchedule?.endTime}
                disabled
              />
            </div>
            <div className="mt-3">
              <Label>Phòng</Label>
              <TextInput
                type="text"
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.room}
                disabled
              />
            </div>
            <div className="mt-3">
              <Label>Giá (VND)</Label>
              <TextInput
                type="text"
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.price}
                disabled
              />
            </div>

            <div className="mt-5">
              <Label className="text-md">Ghế </Label>
              <div className="mt-3 py-5 ">
                {scheduleSeats && (
                  <Seats
                    seats={scheduleSeats}
                    refetchSeats={refetchSeats}
                    scheduleId={selectedSchedule?.id}
                  />
                )}
              </div>
            </div>

            <hr className="w-full " />

            <div className="flex justify-center ">
              <Button color="failure" onClick={deleteHandle} className="mt-8">
                <HiTrash className="mr-2 text-lg" />
                Xóa lịch
              </Button>
            </div>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
};

const Seats: React.FC<{
  seats: any[];
  refetchSeats: () => void;
  scheduleId: number | undefined;
}> = ({ seats, refetchSeats, scheduleId }) => {
  useEffect(() => {
    if (seats.length > 0) {
      setRows(constructRows(seats));
    }
  }, [seats]);

  const constructRows = (seats: TSeat[]) => {
    const rows: Record<string, TSeat[]> = {};

    seats.forEach((seat) => {
      if (!rows[seat.seatCode[0]]) {
        rows[seat.seatCode[0]] = [];
      }
      rows[seat.seatCode[0]].push(seat);
    });

    console.log("rows ", rows);
    return rows;
  };

  const [rows, setRows] = useState(constructRows(seats));
  const [selectedSeats, setSelectedSeats] = useState<TSeat[]>([]);
  const user = useUser();

  const selectSeat = (seat: TSeat) => {
    if (seat.status === 2 || seat.status === 3) {
      return;
    }

    if (seat.status === 1) {
      if (!selectedSeats.includes(seat)) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        setSelectedSeats(
          selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
        );
      }
    }
    console.log(selectedSeats);
  };

  const lockSeatHandler = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Hãy chọn ít nhất một ghế");
      return;
    }
    const confirmLock = window.confirm("Bạn có muốn đặt ghế này không ?");
    if (confirmLock) {
      try {
        const numberSeats = selectedSeats.map((seat) => {
          return seat.numberSeat;
        });

        const reserveData = {
          numberSeats: numberSeats,
          scheduleId: scheduleId,
          customerId: user.user.userId,
        };

        await apiClient.post("/reserve", JSON.stringify(reserveData));

        const bookingData = await apiClient.post(
          "/booking",
          JSON.stringify({ ...reserveData, paymentDestinationId: "VNPAY" })
        );
        console.log(bookingData.data.data.id);
        await apiClient.patch(
          "/booking/update-status",
          JSON.stringify({
            id: bookingData.data.data.id,
            bookingStatus: 3,
          })
        );
        setSelectedSeats([]);
        refetchSeats();
        toast.success("Đặt chỗ thành công");
      } catch (error: any) {
        toast.error(error.response.data.messages[0]);
      }
    }
  };

  if (Object.keys(rows).length > 0) {
    return (
      <>
        <div className="flex justify-center">
          <Button className="bg-sky-600" onClick={lockSeatHandler}>
            Đặt chỗ
          </Button>
        </div>
        <div className="flex justify-center mt-4 ">
          <div className="px-10 space-y-2">
            <div className="flex gap-8 mt-2">
              <span className="text-black w-[20px] h-[20px]"></span>

              <div className="flex gap-4">
                {Array(rows[Object.keys(rows)[0]].length)
                  .fill(0)
                  .map((v, index) => {
                    return (
                      <span
                        className="w-[20px] h-[20px] text-center"
                        key={index}
                      >
                        {index + 1}
                      </span>
                    );
                  })}
              </div>
            </div>

            {Object.keys(rows).map((row) => {
              if (!row) {
                return <div key={"empty_row"} className="h-[20px]"></div>;
              }

              return (
                <div className="flex gap-8 mt-2" key={row}>
                  <span className="text-black w-[20px]">{row}</span>

                  <div className="flex gap-4">
                    {rows[row].map((seat: TSeat) => {
                      if (!seat) {
                        return (
                          <div
                            key={"empty_seat"}
                            className="w-[20px] h-[20px]"
                          ></div>
                        );
                      }
                      return (
                        <Seat
                          key={seat.id}
                          seat={seat}
                          selectSeat={() => selectSeat(seat)}
                          selectedSeats={selectedSeats}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};

function Seat({
  seat,
  selectSeat,
  selectedSeats,
}: {
  seat: TSeat;
  selectSeat: () => void;
  selectedSeats: TSeat[];
}) {
  const isSelected = selectedSeats.includes(seat);
  return (
    <div>
      <div
        onClick={() => selectSeat()}
        role={"button"}
        className={`w-[20px] h-[20px]  rounded-b-xl rounded-t border-2  
        hover:bg-green-300
        ${
          (seat.status === 2 || seat.status === 3) &&
          "bg-red-500 border-red-500 hover:bg-red-500"
        }
        ${
          isSelected &&
          seat.status === 1 &&
          "bg-green-500 border-green-500 hover:bg-green-400"
        }
        border-black/30
      `}
      ></div>
    </div>
  );
}
