import { Power, Search, Settings, User } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { IUser } from "@/Types";
import { useSignOutAccount } from "@/Database/React Query/queries";
import { useEffect } from "react";

const Topbar = ({ user }: { user: IUser }) => {

    const { pathname } = useLocation()
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess]);

    return (
        <header className='bg-body w-full border-b border-border p-3 z-50'>
            <div className="flex flex-row items-center justify-between">

                <div>
                    <h1 className="text-white font-bold text-[1.4rem]">
                        {pathname === "/" && "Home"}
                    </h1>
                </div>

                <div className="flex flex-row items-center gap-10">
                    <div className="bg-input w-[330px] h-[40px] mt-[3px] rounded-lg relative">
                        <Search className="absolute left-3 top-[9px] " size={20} />
                        <input type="text" className="w-full h-full bg-transparent pl-12 pr-4 text-white font-bold text-[.9rem] placeholder:font-normal placeholder:text-default-500]" placeholder="Search Des" />
                    </div>
                    <Dropdown placement="bottom" backdrop="blur" className="bg-card border-border text-white">
                        <DropdownTrigger>
                            <div className="flex flex-row items-center gap-5 cursor-pointer">
                                <div>
                                    <h2 className="text-white font-bold text-[14px]">{user.name}</h2>
                                    <h3 className="text-default-500 font-light text-[12px]">@{user.username}</h3>
                                </div>
                                <img className="w-[45px] h-[45px] rounded-full" src={user.profile} alt="" />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu color="primary" aria-label="Profile Actions" variant="flat" className="">
                            <DropdownItem key="profile" className="h-14 gap-2 bg-body">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold text-default-500">{user.email}</p>
                            </DropdownItem>
                            <DropdownItem
                                key="profile"
                                startContent={<User size={19} />}>
                                <Link to={`/${user.username}`}>
                                    Profile
                                </Link>
                            </DropdownItem>
                            <DropdownItem
                                key="settings"
                                startContent={<Settings size={19} />}>
                                My Settings
                            </DropdownItem>
                            <DropdownItem
                                className="bg-red-500 mt-5"
                                key="settings"
                                onPress={() => signOut()}
                                startContent={<Power size={19} />}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </header >
    )
}

export default Topbar
