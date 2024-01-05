import { Sidebar, TextInput } from "flowbite-react";
import { HiSearch, HiUsers, HiFilm, HiChartBar } from "react-icons/hi";
import { BsFillHouseDoorFill, BsDoorClosedFill } from "react-icons/bs";
import { PiSlideshowLight } from "react-icons/pi";
import { BiTime, BiSolidCategoryAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCheck } from "react-icons/fa";
const SideBar: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const getUser = () => {
    setUser(JSON.parse(localStorage.getItem("USER") as any) || null);
  };
  useEffect(() => {
    getUser();
  }, [router]);

  const pathname = usePathname();

  return (
    <Sidebar className="bg-gray-50 hidden lg:fixed top-0 left-0 z-5 flex-col flex-shrink-0 pt-[60px] h-full duration-75  lg:flex transition-width  w-64 rounded-none">
      <div className="flex h-full flex-col justify-between py-2 rounded-none">
        <div className="rounded-none">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/manage/dashboard"
                icon={HiChartBar}
                className={
                  pathname === "/manage/dashboard" ? "bg-slate-300" : ""
                }
              >
                Dashboard
              </Sidebar.Item>

              {user?.role === "Superadmin" && (
                <Sidebar.Item
                  href="/manage/films"
                  icon={HiFilm}
                  className={pathname === "/manage/films" ? "bg-slate-300" : ""}
                >
                  Phim
                </Sidebar.Item>
              )}

              {user?.role === "Superadmin" && (
                <Sidebar.Item
                  href="/manage/employee"
                  icon={HiUsers}
                  className={
                    pathname === "/manage/employee" ? "bg-slate-300" : ""
                  }
                >
                  Nhân viên
                </Sidebar.Item>
              )}

              <Sidebar.Item
                href="/manage/customer"
                icon={HiUsers}
                className={
                  pathname === "/manage/customer" ? "bg-slate-300" : ""
                }
              >
                Khách hàng
              </Sidebar.Item>

              {user?.role === "Superadmin" && (
                <Sidebar.Item
                  href="/manage/cinema"
                  icon={BsFillHouseDoorFill}
                  className={
                    pathname === "/manage/cinema" ? "bg-slate-300" : ""
                  }
                >
                  Rạp
                </Sidebar.Item>
              )}

              {user?.role === "Superadmin" && (
                <Sidebar.Item
                  href="/manage/room"
                  icon={BsDoorClosedFill}
                  className={pathname === "/manage/room" ? "bg-slate-300" : ""}
                >
                  Phòng
                </Sidebar.Item>
              )}

              <Sidebar.Item
                href="/manage/filmScheduling"
                icon={BiTime}
                className={
                  pathname === "/manage/filmScheduling" ? "bg-slate-300" : ""
                }
              >
                Lịch chiếu
              </Sidebar.Item>

              {user?.role === "Superadmin" && (
                <Sidebar.Item
                  href="/manage/category"
                  icon={BiSolidCategoryAlt}
                  className={
                    pathname === "/manage/category" ? "bg-slate-300" : ""
                  }
                >
                  Thể loại
                </Sidebar.Item>
              )}
              {user?.role === "Superadmin" && (
                <Sidebar.Item
                  href="/manage/poster"
                  icon={PiSlideshowLight}
                  className={
                    pathname === "/manage/poster" ? "bg-slate-300" : ""
                  }
                >
                  Poster
                </Sidebar.Item>
              )}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default SideBar;
