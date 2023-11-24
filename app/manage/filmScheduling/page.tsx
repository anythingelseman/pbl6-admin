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
} from "flowbite-react";
import { useState, useEffect, useRef } from "react";
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
  startTime: string;
  endTime?: string;
  film?: string;
  room?: string;
  price: number;
  filmId?: number;
  roomId?: number;
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
      const response = await apiClient.get(`/Room?OrderBy=id`);
      const data = response.data;
      setRoomApiResponse(data);
      console.log(data);
    };
    fetchData();
  }, []);

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
      const response = await apiClient.get(`/schedule/cinema/${cinemaId}`);
      const data = response.data;
      setScheduleApiResponse(data);
      setCurrentRooms(getRoomsByCinemaId(roomApiResponse?.data, cinemaId));
      console.log(data);
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

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Film Scheduling
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="mb-4 sm:mb-0 sm:pr-3 ">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative mt-1 lg:w-64 xl:w-96 flex gap-x-3">
                <Select name="cinemaId" required onChange={changeHandle}>
                  {cinemaApiResponse?.data?.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </option>
                  ))}
                </Select>
                <Button className="bg-sky-600" onClick={searchHandle}>
                  Search
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center sm:justify-end">
              <AddScheduleModal
                filmApiResponse={filmApiResponse}
                cinemaName={getCinemaNameById(cinemaId)}
                currentRooms={currentRooms}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {scheduleApiResponse && (
                <ScheduleTable
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
}> = ({ filmApiResponse, cinemaName, currentRooms }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<ScheduleItem>({
    duration: 0,
    description: "",
    startTime: "",
    filmId: 0,
    roomId: 0,
    price: 0,
  });

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
    if (!formData.filmId) throw new Error("Please select a film");
    if (!formData.roomId) throw new Error("Please select a room");
    apiClient
      .post(`/schedule`, JSON.stringify(formData))
      .then((response) => {
        console.log("Post request was successful:", response.data);
        location.reload();
      })
      .catch((error) => {
        console.error("Error posting data:", error.messages);
      });
  };
  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add schedule
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
              <Label>Film</Label>
              <Select name="filmId" onChange={handleChange} required>
                <option selected value="">
                  Select film
                </option>
                {filmApiResponse?.data.map((film) => (
                  <option key={film.id} value={film.id}>
                    {film.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              <Label>Duration</Label>
              <TextInput
                name="duration"
                className="mt-1"
                type="number"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Label>Description</Label>
              <TextInput
                name="description"
                className="mt-1"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <Label>Start time</Label>
              <br />
              <input
                type="datetime-local"
                onChange={handleChange}
                className="rounded"
                name="startTime"
              />
            </div>
            <div className="mb-3">
              <Label>Cinema</Label>
              <TextInput className="mt-1" value={cinemaName} disabled />
            </div>
            <div className="mb-3">
              <Label>Room</Label>
              <Select name="roomId" onChange={handleChange} required>
                <option selected value="">
                  Select room
                </option>
                {currentRooms?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              <Label>Price</Label>
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
              Add
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
}> = ({ scheduleApiResponse, currentRooms }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null
  );
  const calendarRef = useRef(null);
  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    console.log(info.event._def.publicId);
    setSelectedSchedule(getScheduleById(Number(info.event._def.publicId)));
  };
  const resources = currentRooms?.map((room) => ({
    id: room.id || 0,
    title: room.name,
  }));

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setSelectedSchedule(null);
    console.log(selectedEvent);
  };

  function getRoomIdByName(
    rooms: RoomData[] | undefined,
    targetRoomName: string | undefined
  ): number | null {
    const foundRoom = rooms?.find((room) => room.name === targetRoomName);

    // If a room with the specified name is found, return its ID; otherwise, return null
    return foundRoom ? foundRoom.id || null : null;
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
    resourceId: getRoomIdByName(currentRooms, schedule.room),
  }));

  const deleteHandle = () => {
    handleCloseModal();
    apiClient
      .delete(`/schedule?Id=${selectedSchedule?.id}`)
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
        editable={true}
        selectable={true}
        selectMirror={true}
        events={events as EventSourceInput | undefined}
        resourceAreaHeaderContent="Rooms"
        //@ts-ignore
        resources={resources}
      />
      <Modal show={!!selectedEvent} onClose={handleCloseModal}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Details</strong>
        </Modal.Header>
        <form className="bg-white">
          <Modal.Body>
            <div>
              <Label>Film</Label>
              <TextInput
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.film}
                disabled
              />
            </div>
            <div>
              <Label>Duration</Label>
              <TextInput
                type="number"
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.duration}
                disabled
              />
            </div>
            <div className="mt-3">
              <Label htmlFor="price">Start time: </Label>
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
              <Label htmlFor="price">End time: </Label>
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
              <Label>Room</Label>
              <TextInput
                type="text"
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.room}
                disabled
              />
            </div>
            <div className="mt-3">
              <Label>Price</Label>
              <TextInput
                type="text"
                className="mt-1"
                onChange={handleChange}
                value={selectedSchedule?.price}
                disabled
              />
            </div>
            <div className="flex justify-center">
              <Button color="failure" onClick={deleteHandle} className="mt-8">
                <HiTrash className="mr-2 text-lg" />
                Delete
              </Button>
            </div>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
};
