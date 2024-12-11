import React, { useEffect, useState } from "react"
import { Routes, useLocation } from "react-router-dom"
import TopBarProgress from "react-topbar-progress-indicator"

const CustomSwitch = ({ children }: { children: any }) => {
    const [progress, setProgress] = useState(false)
    const [prevLoc, setPrevLoc] = useState("")
    const location = useLocation()

    useEffect(() => {
        setPrevLoc(location.pathname)
        setProgress(true)
        if (location.pathname === prevLoc) {
            setPrevLoc('')
            //thanks to ankit sahu
        }
    }, [location])

    useEffect(() => {
        setProgress(false)
    }, [prevLoc])

    TopBarProgress.config({
        barColors: {
            "0": "#131313",
            "1.0": "#FF6500"
        },
        shadowBlur: 10,
        shadowColor: "#FF6500",
        barThickness: 2,
    });

    return (
        <>
            {progress && <TopBarProgress />}
            <Routes>{children}</Routes>
        </>
    )
}

export default CustomSwitch
