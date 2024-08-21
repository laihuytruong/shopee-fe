import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { Header, Footer } from '~/components'
import { increment } from '~/features/CounterSlice'
import { selectPaginationInfo, setPaginationInfo } from '~/features/UserSlice'

interface PaginationInfo {
    page: number
    pageSize: number
    totalPage: number
    totalCounts: number
}

const Public = () => {
    const { pathname } = useLocation()
    const paginationInfo: PaginationInfo = useAppSelector(selectPaginationInfo)
    const dispatch = useAppDispatch()

    const currentLocation = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (currentLocation.current) {
            const { clientHeight, scrollHeight, scrollTop } =
                currentLocation.current

            if (Math.round(scrollTop) + clientHeight === scrollHeight - 1) {
                if (paginationInfo.page < paginationInfo.totalPage) {
                    dispatch(
                        setPaginationInfo({
                            ...paginationInfo,
                            page: paginationInfo.page + 1,
                        })
                    )
                    dispatch(increment())
                }
            }
        }
    }

    useEffect(() => {
        dispatch(
            setPaginationInfo({
                page: 1,
                pageSize: 5,
                totalPage: 1,
                totalCounts: 0,
            })
        )
        dispatch(increment())
        const currentLocationElement = currentLocation.current
        if (currentLocationElement) {
            currentLocationElement.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (currentLocationElement) {
                currentLocationElement.removeEventListener(
                    'scroll',
                    handleScroll
                )
            }
        }
    }, [])

    return (
        <div
            ref={currentLocation}
            className="w-full flex flex-col items-center h-screen overflow-y-auto"
        >
            <div
                className={`w-full flex justify-center text-white text-[13px] h-[119px] ${
                    pathname === '/' && 'fixed top-0 z-50'
                }`}
            >
                <Header />
            </div>
            <Outlet />
            <div className="bg-white flex justify-center border-t-4 mt-[70px] border-solid border-t-main w-full">
                <Footer />
            </div>
        </div>
    )
}

export default Public
