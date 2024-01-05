"use client";
import apiClient from "@/services/apiClient";
import {
  Button,
  Label,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import {
  InputHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface Customer {
  id: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}
export default function CustomerPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(`/customer`, {
          params: {
            Keyword: searchTerm !== "" ? searchTerm : undefined,
            PageNumber: currentPage,
          },
        });

        setIsLoading(false);
        setCustomers(response.data.data);
        setTotalPage(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [searchTerm, currentPage]);

  return (
    <div className="p-10">
      <div>
        <div className="mb-4 sm:mb-0 sm:pr-3 ">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative mt-1 lg:w-64 xl:w-96 flex gap-x-3">
            <TextInput
              ref={inputRef}
              className="w-[400px]"
              placeholder="Tìm kiếm khách hàng..."
            />
            <Button
              onClick={() => {
                if (!inputRef || !inputRef.current) return;
                setSearchTerm(inputRef.current.value);
              }}
              className="bg-sky-600"
            >
              Tìm
            </Button>
            <Button
              onClick={() => {
                if (!inputRef || !inputRef.current) return;

                setSearchTerm("");
                inputRef.current.value = "";
              }}
              className="bg-sky-600"
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold">Khách hàng</h3>

        {isLoading && (
          <div className="min-h-[300px] flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {!isLoading && customers && (
          <div className="border-[3px] border-black rounded-md py-2 mt-8">
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-2 text-center ">Tên</div>
              <div className="col-span-3 text-center">Email</div>
              <div className="col-span-2 text-center">Số điện thoại</div>
              <div className="col-span-3 text-center">Địa chỉ</div>
              <div className="col-span-2 text-center">Ngày sinh</div>
            </div>

            <ul className=" mt-8">
              {customers.map((customer, idx) => {
                return (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    index={idx}
                  />
                );
              })}
            </ul>
          </div>
        )}
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination
            layout="navigation"
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
          />
        </div>
      </div>
    </div>
  );
}

interface Booking {
  id: number;
  bookingRefId: string;
  customerName: string;
  phoneNumber: string;
  scheduleId: number;
  totalPrice: number;
  bookingDate: string;
  filmName: string;
  cinemaName: string;
  usageStatus: string;
  createdOn: string;
  lastModifiedOn: string;
}

const CustomerRow = ({
  customer,
  index,
}: {
  customer: Customer;
  index: number;
}) => {
  const [cinemas, setCinemas] = useState<any[]>();
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(-1);
  const [bookings, setBookings] = useState<Booking[]>();
  const header = useRef<any | null>(null);
  const cinemaDropdown = useRef<any | null>(null);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options,
    );
    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(`/cinema`);

        setCinemas(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (openModal) {
      fetchData();
    }

    fetchData();
  }, [openModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(`/booking`, {
          params: {
            customerId: customer.id,
            cinemaId: selectedCinema !== -1 ? selectedCinema : undefined,
          },
        });

        setIsLoading(false);
        setBookings(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (openModal) {
      fetchData();
    }

    fetchData();
  }, [openModal, selectedCinema]);
  useEffect(() => {
    if (openModal) {
      if (cinemaDropdown.current) {
        const width =
          cinemaDropdown.current.parentElement.parentElement.clientWidth - 100;
        cinemaDropdown.current.style.width = `${width}px`;
      }
    }
  }, [openModal, cinemaDropdown.current]);

  useEffect(() => {
    if (openModal) {
      window.addEventListener("resize", (e) => {
        if (cinemaDropdown.current) {
          const width =
            cinemaDropdown.current.parentElement.parentElement.clientWidth -
            100;
          cinemaDropdown.current.style.width = `${width}px`;
        }
      });
    }
  }, [openModal]);

  return (
    <>
      <li
        role="button"
        className="hover:bg-black/10"
        onClick={() => setOpenModal(true)}
      >
        <div
          className="grid grid-cols-12 border-t-[2px] border-black/50 items-center py-4 gap-4"
          key={customer.id}
        >
          <div
            className="col-span-2 text-center"
            style={{ wordWrap: "break-word" }}
          >
            {customer.customerName}
          </div>
          <div
            className="col-span-3 text-center"
            style={{ wordWrap: "break-word" }}
          >
            {customer.email}
          </div>
          <div
            className="col-span-2 text-center"
            style={{ wordWrap: "break-word" }}
          >
            {customer.phoneNumber}
          </div>
          <div
            className="col-span-3 text-center"
            style={{ wordWrap: "break-word" }}
          >
            {customer.address}
          </div>
          <div
            className="col-span-2 text-center"
            style={{ wordWrap: "break-word" }}
          >
            {formatDate(customer.dateOfBirth)}
          </div>
        </div>
      </li>
      <Modal size={"8xl"} show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="w-full">
          <div
            ref={cinemaDropdown}
            className="flex items-center gap-4 justify-between "
          >
            <div>Lịch sử đặt vé</div>

            <div>
              <Select
                id="cinemas"
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(Number(e.target.value))}
              >
                <option value={-1}>Tất cả</option>
                {cinemas &&
                  cinemas.map((cinema) => {
                    return (
                      <option key={cinema.id} value={cinema.id}>
                        {cinema.name}
                      </option>
                    );
                  })}
              </Select>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <Table.Head>
              <Table.HeadCell>Tên khách hàng</Table.HeadCell>
              <Table.HeadCell>Số điện thoại</Table.HeadCell>
              <Table.HeadCell>Tổng tiền</Table.HeadCell>
              <Table.HeadCell>Ngày đặt</Table.HeadCell>
              <Table.HeadCell>Tên phim</Table.HeadCell>
              <Table.HeadCell>Rạp</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {bookings &&
                bookings.map((booking) => {
                  return <BookingRow booking={booking} key={booking.id} />;
                })}
            </Table.Body>
          </Table>
          {bookings && bookings.length === 0 && (
            <div className="text-center text-xl mt-10">
              Khách hàng chưa có booking nào được tạo
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

const BookingRow = ({ booking }: { booking: Booking }) => {
  const [openBookingInfo, setOpenBookingInfo] = useState(false);

  return (
    <>
      <Table.Row
        role="button"
        onClick={() => setOpenBookingInfo(true)}
        key={booking.id}
        className="bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {booking.customerName}
        </Table.Cell>
        <Table.Cell>{booking.phoneNumber}</Table.Cell>
        <Table.Cell>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(booking.totalPrice)}
        </Table.Cell>
        <Table.Cell>
          {new Date(booking.bookingDate).toLocaleString()}
        </Table.Cell>
        <Table.Cell>{booking.filmName}</Table.Cell>
        <Table.Cell>{booking.cinemaName}</Table.Cell>
        <Table.Cell className="uppercase">{booking.usageStatus}</Table.Cell>
      </Table.Row>

      <BookingInfoModal
        bookingId={booking.bookingRefId}
        show={openBookingInfo}
        setOpenModal={setOpenBookingInfo}
      />
    </>
  );
};

interface BookingInformation {
  id: number;
  bookingRefId: string;
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  bookingCurrency: string;
  bookingLanguage: string;
  bookingDate: string;
  startTime: string;
  cinemaName: string;
  filmName: string;
  usageStatus: string;
  roomName: string;
  image: string;
  tickets: {
    id: number;
    numberSeat: number;
    seatCode: string;
    typeTicket: number;
    price: number;
  }[];
}

const BookingInfoModal = ({
  bookingId,
  show,
  setOpenModal,
}: {
  bookingId: string;
  show: boolean;
  setOpenModal: (s: boolean) => void;
}) => {
  const [bookingData, setBookingData] = useState<BookingInformation>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/booking/${bookingId}`);
        console.log("info", response.data);

        setBookingData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);
  return (
    <Modal show={show} onClose={() => setOpenModal(false)}>
      <Modal.Header>Booking Info</Modal.Header>
      <Modal.Body>
        {bookingData && (
          <div className="modal-content">
            <h2 className="text-2xl font-bold mb-4">{bookingData.filmName}</h2>
            <p>
              <strong>Customer name:</strong> {bookingData.customerName}
            </p>
            <p>
              <strong>Phone number:</strong> {bookingData.phoneNumber}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(bookingData.totalPrice)}
            </p>
            <p>
              <strong>Booking date:</strong>{" "}
              {new Date(bookingData.bookingDate).toLocaleString()}
            </p>
            <p>
              <strong>Film:</strong> {bookingData.filmName}
            </p>
            <p>
              <strong>Start time:</strong>{" "}
              {new Date(bookingData.startTime!).toLocaleString()}
            </p>
            <p>
              <strong>Cinema:</strong> {bookingData.cinemaName}
            </p>
            <p>
              <strong>Room:</strong> {bookingData.roomName}
            </p>
            <p>
              <strong>Seats:</strong>{" "}
              {bookingData.tickets &&
                bookingData.tickets.map((ticket) => ticket.seatCode).join(",")}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
