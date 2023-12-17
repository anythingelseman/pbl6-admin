import { Sidebar, TextInput } from "flowbite-react";
import { HiSearch, HiUsers, HiFilm } from "react-icons/hi";
import { BsFillHouseDoorFill, BsDoorClosedFill } from "react-icons/bs";
import { PiSlideshowLight } from "react-icons/pi";
import { BiTime, BiSolidCategoryAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const SideBar: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const getUser = () => {
    setUser(JSON.parse(localStorage.getItem("USER") as any) || null);
  };
  useEffect(() => {
    getUser();
  }, [router]);
  return (
    <Sidebar className="bg-gray-50 hidden lg:fixed top-0 left-0 z-5 flex-col flex-shrink-0 pt-[60px] h-full duration-75  lg:flex transition-width  w-64 rounded-none">
      <div className="flex h-full flex-col justify-between py-2 rounded-none">
        <div className="rounded-none">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/manage/films" icon={HiFilm}>
                Film
              </Sidebar.Item>

              {user?.role === "Superadmin" && (
                <Sidebar.Item href="/manage/employee" icon={HiUsers}>
                  Employee
                </Sidebar.Item>
              )}

              <Sidebar.Item href="/manage/cinema" icon={BsFillHouseDoorFill}>
                Cinema
              </Sidebar.Item>

              <Sidebar.Item href="/manage/room" icon={BsDoorClosedFill}>
                Room
              </Sidebar.Item>
              <Sidebar.Item href="/manage/filmScheduling" icon={BiTime}>
                Film Scheduling
              </Sidebar.Item>

              <Sidebar.Item href="/manage/category" icon={BiSolidCategoryAlt}>
                Category
              </Sidebar.Item>
              <Sidebar.Item href="/manage/poster" icon={PiSlideshowLight}>
                Poster
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default SideBar;
