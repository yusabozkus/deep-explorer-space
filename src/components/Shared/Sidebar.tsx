import { IUser } from "@/Types";
import { Avatar, Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Notifications from "./Notifications";

const Sidebar = ({ user }: { user: IUser }) => {
  const { pathname } = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="fixed left-0 top-0 bottom-0 h-full bg-body border-r border-border p-4 flex flex-col items-center justify-between">
      <img className="w-[40px]" src="/images/icon.png" alt="" />
      <ul className="mt-10 stroke-[1.56] flex flex-col gap-10">
        <Tooltip
          closeDelay={100}
          classNames={{
            content:
              "bg-card border border-border box-shadow shadow-[0px_0px_50px_7px_#000] text-[.8rem] p-2",
          }}
          placement="right"
          size="lg"
          content="Home"
        >
          <li className={`w-max rounded-lg`}>
            <Link
              to={"/"}
              className={`transition-all ease-linear flex flex-row items-center gap-3 w-full ${pathname === "/" ? "stroke-body fill-white" : "stroke-[#b9b9b9] fill-none"}`}
            >
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24.00 24.00"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g id="style=linear" clipPath="url(#clip0_1_106)">
                    {" "}
                    <g id="home-line">
                      {" "}
                      <path
                        className={`${pathname === "/" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`}
                        id="vector"
                        d="M18.5409 22.5H5.44995C3.7931 22.5 2.44995 21.1569 2.44995 19.5V11.6654C2.44995 10.5118 2.94804 9.4143 3.81634 8.65474L10.0202 3.22784C11.1512 2.2385 12.8396 2.23851 13.9706 3.22784L20.1745 8.65474C21.0428 9.4143 21.5409 10.5118 21.5409 11.6654V19.5C21.5409 21.1569 20.1977 22.5 18.5409 22.5Z"
                        strokeLinecap="round"
                      ></path>{" "}
                      <path
                        id="vector_2"
                        d="M10 16.8636H14"
                        strokeLinecap="round"
                      ></path>{" "}
                    </g>{" "}
                  </g>{" "}
                  <defs>
                    {" "}
                    <clipPath id="clip0_1_106">
                      {" "}
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 24) rotate(-90)"
                      ></rect>{" "}
                    </clipPath>{" "}
                  </defs>{" "}
                </g>
              </svg>
            </Link>
          </li>
        </Tooltip>
        <Tooltip
          closeDelay={100}
          classNames={{
            content:
              "bg-card border border-border box-shadow shadow-[0px_0px_50px_7px_#000] text-[.8rem] p-2",
          }}
          placement="right"
          size="lg"
          content="Create Article"
        >
          <li className={`w-max rounded-lg`}>
            <Link
              to={"/create-article"}
              className={`transition-all ease-linear flex flex-row items-center gap-3 w-full ${pathname === "/create-article" ? "stroke-body fill-white" : "stroke-[#b9b9b9] fill-none"}`}
            >
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    className={`${pathname === "/create-article" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`}
                    d="M9 12H15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    className={`${pathname === "/create-article" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`}
                    d="M12 9L12 15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                  <path
                    className={`${pathname === "/create-article" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`}
                    d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"
                  ></path>{" "}
                </g>
              </svg>
            </Link>
          </li>
        </Tooltip>
        <Tooltip
          closeDelay={100}
          classNames={{
            content:
              "bg-card border border-border box-shadow shadow-[0px_0px_50px_7px_#000] text-[.8rem] p-2",
          }}
          placement="right"
          size="lg"
          content="Articles"
        >
          <li className={`w-max rounded-lg`}>
            <Link
              to={"/articles"}
              className={`transition-all ease-linear flex flex-row items-center gap-3 w-full ${pathname === "/articles" ? "stroke-body fill-white" : "stroke-[#b9b9b9] fill-none"}`}
            >
              <svg
                className="transition-all ease-linear"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g id="style=linear">
                    {" "}
                    <g id="document">
                      {" "}
                      <path
                        className={`${pathname === "/articles" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`}
                        id="rec"
                        d="M3 7C3 4.23858 5.23858 2 8 2H16C18.7614 2 21 4.23858 21 7V17C21 19.7614 18.7614 22 16 22H8C5.23858 22 3 19.7614 3 17V7Z"
                      ></path>{" "}
                      <path
                        id="line"
                        d="M8 8.2002H16"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        id="line_2"
                        d="M8 12.2002H16"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        id="line_3"
                        d="M9 16.2002H15"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
            </Link>
          </li>
        </Tooltip>
      </ul>
      <div>
        <Tooltip
          closeDelay={100}
          classNames={{
            content:
              "bg-card border border-border box-shadow shadow-[0px_0px_50px_7px_#000] text-[.8rem] p-2",
          }}
          placement="right"
          size="lg"
          content="Notifications"
        >
          <Button
            color={isOpen ? "primary" : "default"}
            variant={isOpen ? "shadow" : "solid"}
            onPress={() => onOpen()}
            className="w-[40px] h-[40px] mb-5"
            isIconOnly
          >
            <Bell size={20} />
          </Button>
        </Tooltip>
        <Notifications
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
        <Avatar size="md" src={user.profile} />
      </div>
    </div>
  );
};

export default Sidebar;
