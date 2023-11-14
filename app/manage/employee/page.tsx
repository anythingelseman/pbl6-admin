"use client";

import {
  Button,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
  Datepicker,
} from "flowbite-react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function DashBoardPage() {
  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Employee
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchForProducts />

            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <ProductsTable />
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </>
  );
}

const SearchForProducts = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="products-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="products-search"
          name="products-search"
          placeholder="Name search "
        />
      </div>
    </form>
  );
};

const AddProductModal = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button className="bg-sky-600" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add </strong>
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
                <Label htmlFor="category">Username</Label>
                <TextInput id="category" name="category" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="brand">Password</Label>
                <TextInput id="brand" name="brand" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="price">Phone number</Label>
                <TextInput id="price" name="price" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="price">Address</Label>
                <TextInput id="price" name="price" className="mt-1" />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Date of birth</Label>
                <Datepicker />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-sky-600" onClick={() => setOpen(false)}>
            Add
          </Button>
        </Modal.Footer>
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
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit </strong>
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
                <Label htmlFor="category">Username</Label>
                <TextInput id="category" name="category" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="brand">Password</Label>
                <TextInput id="brand" name="brand" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="price">Phone number</Label>
                <TextInput id="price" name="price" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="price">Address</Label>
                <TextInput id="price" name="price" className="mt-1" />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Date of birth</Label>
                <Datepicker />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-sky-600" onClick={() => setOpen(false)}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteProductModal = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Delete
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0">
          <span className="sr-only">Delete product</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => setOpen(false)}>
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

const ProductsTable = function () {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Username</Table.HeadCell>
        <Table.HeadCell>Password</Table.HeadCell>
        <Table.HeadCell>Phone</Table.HeadCell>
        <Table.HeadCell>Address</Table.HeadCell>
        <Table.HeadCell>Date of birth</Table.HeadCell>
        <Table.HeadCell>Action</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Nguyen Van A
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400"></div>
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            vana123
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            123456
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            0853746252
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            Da Nang
          </Table.Cell>
          <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
            16/12/2002
          </Table.Cell>
          <Table.Cell className="space-x-2 whitespace-nowrap p-4">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

const Pagination = function () {
  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <a
          href="#"
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </a>
        <a
          href="#"
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </a>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            1-20
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            2290
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Previous
        </a>
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Next
          <HiChevronRight className="ml-1 text-base" />
        </a>
      </div>
    </div>
  );
};
