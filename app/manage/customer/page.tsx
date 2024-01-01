"use client";
import apiClient from "@/services/apiClient";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

interface Customer {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}
export default function CustomerPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(`/customer`, {
          params: {
            Keyword: searchTerm !== "" ? searchTerm : undefined,
          },
        });

        setIsLoading(false);
        setCustomers(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [searchTerm]);

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
              placeholder="Search customer..."
            />
            <Button
              onClick={() => {
                if (!inputRef || !inputRef.current) return;
                setSearchTerm(inputRef.current.value);
              }}
              className="bg-sky-600"
            >
              Search
            </Button>
            <Button
              onClick={() => {
                if (!inputRef || !inputRef.current) return;

                setSearchTerm("");
                inputRef.current.value = "";
              }}
              className="bg-sky-600"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold">Customers</h3>

        {isLoading && (
          <div className="min-h-[300px] flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {!isLoading && customers && (
          <div className="border-[3px] border-black rounded-md py-2 mt-8">
            <div className="grid grid-cols-12 mt-4">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-2 text-center">Name</div>
              <div className="col-span-3 text-center">Phone number</div>
              <div className="col-span-3 text-center">Address</div>
              <div className="col-span-2 text-center">Date of birth</div>
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
      </div>
    </div>
  );
}

const CustomerRow = ({
  customer,
  index,
}: {
  customer: Customer;
  index: number;
}) => {
  const [expand, setExpand] = useState(false);
  const [bookings, setBookings] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
    if (expand) {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          const response = await apiClient.get(`/customer`);

          setIsLoading(false);
          setBookings(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [expand]);

  return (
    <li>
      <div
        className="grid grid-cols-12 border-t-[2px] border-black/50 items-center py-4"
        key={customer.id}
      >
        <div className="col-span-1 text-center">{index}</div>
        <div className="col-span-2 text-center">{customer.customerName}</div>
        <div className="col-span-3 text-center">{customer.phoneNumber}</div>
        <div className="col-span-3 text-center">{customer.address}</div>
        <div className="col-span-2 text-center">
          {formatDate(customer.dateOfBirth)}
        </div>

        <div className="col-span-1 text-center">
          <button onClick={() => setExpand(!expand)}>
            <HiChevronDown className="text-2xl" />
          </button>
        </div>
      </div>

      {expand && (
        <div className="min-h-[500px] border-t-2">
          {isLoading && (
            <div className="min-h-[300px] flex items-center justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && <div></div>}

          {/* {!isLoading && bookings && <div></div>} */}
        </div>
      )}
    </li>
  );
};
