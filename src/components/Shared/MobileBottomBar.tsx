import { IUser } from '@/Types'
import { Avatar, Tooltip } from '@nextui-org/react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const MobileBottomBar = ({ user }: { user: IUser }) => {

    const { pathname } = useLocation()

    return (
        <div className='w-full bg-gradient-to-t from-black to-transparent  py-3'>
            <ul className="stroke-[1.56] flex flex-row justify-around w-full">
                <li className={`w-max rounded-lg`}>
                    <Link to={"/"} className={`transition-all ease-linear flex flex-row items-center w-full ${pathname === "/" ? "stroke-body fill-white" : "stroke-[#b9b9b9] fill-none"}`}>
                        <svg width="32px" height="32px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=linear" clipPath="url(#clip0_1_106)"> <g id="home-line"> <path className={`${pathname === "/" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`} id="vector" d="M18.5409 22.5H5.44995C3.7931 22.5 2.44995 21.1569 2.44995 19.5V11.6654C2.44995 10.5118 2.94804 9.4143 3.81634 8.65474L10.0202 3.22784C11.1512 2.2385 12.8396 2.23851 13.9706 3.22784L20.1745 8.65474C21.0428 9.4143 21.5409 10.5118 21.5409 11.6654V19.5C21.5409 21.1569 20.1977 22.5 18.5409 22.5Z" strokeLinecap="round"></path> <path id="vector_2" d="M10 16.8636H14" strokeLinecap="round"></path> </g> </g> <defs> <clipPath id="clip0_1_106"> <rect width="24" height="24" fill="white" transform="translate(0 24) rotate(-90)"></rect> </clipPath> </defs> </g></svg>
                    </Link>
                </li>
                <li className={`w-max rounded-lg`}>
                    <Link to={"/create-article"} className={`transition-all ease-linear flex flex-row items-center w-full ${pathname === "/create-article" ? "stroke-body fill-white" : "stroke-[#b9b9b9] fill-none"}`}>
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path className={`${pathname === "/create-article" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`} d="M9 12H15" strokeLinecap="round" strokeLinejoin="round"></path> <path className={`${pathname === "/create-article" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`} d="M12 9L12 15" strokeLinecap="round" strokeLinejoin="round"></path> <path className={`${pathname === "/create-article" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`} d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"></path> </g></svg>
                    </Link>
                </li>
                <li className={`w-max rounded-lg`}>
                    <Link to={"/articles"} className={`transition-all ease-linear flex flex-row items-center w-full ${pathname === "/articles" ? "stroke-body fill-white" : "stroke-[#b9b9b9] fill-none"}`}>
                        <svg className="transition-all ease-linear" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="document"> <path className={`${pathname === "/articles" ? "stroke-white" : "stroke-[#b9b9b9]"} transition-all ease-linear`} id="rec" d="M3 7C3 4.23858 5.23858 2 8 2H16C18.7614 2 21 4.23858 21 7V17C21 19.7614 18.7614 22 16 22H8C5.23858 22 3 19.7614 3 17V7Z"></path> <path id="line" d="M8 8.2002H16" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path id="line_2" d="M8 12.2002H16" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path id="line_3" d="M9 16.2002H15" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g> </g></svg>
                    </Link>
                </li>
                <Link to={`/${user.username}`}>
                    <Avatar className='w-[32px] h-[32px]' src={user.profile} />
                </Link>
            </ul>
        </div>
    )
}

export default MobileBottomBar
