import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../../components'

const Public = () => {
    return (
        <div className="w-full flex flex-col items-center h-[2000px]">
            <div className="w-full flex justify-center bg-main text-white text-[13px] h-[119px] fixed z-100">
                <Header />
            </div>
            <Outlet />
        </div>
    )
}

export default Public
