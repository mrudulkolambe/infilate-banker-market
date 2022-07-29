import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { useAuthContext } from '../context/Auth'


const Topbar = ({ show, setShow }) => {
	const { filter, setFilter } = useAuthContext();
	const router = useRouter()

	return (
		<>
			<div className='lg:block hidden w-10/12 fixed top-6 left-position border-b h-20 bg-white shadow-lg z-50 Nunito rounded-tr-3xl'>
				<div className='flex justify-between px-5 items-center h-20'>
					{router.pathname.includes('main') && <input type="text" className='outline-none w-full h-full' placeholder='Search Campaign, User, Email' value={filter} onChange={(e) => { setFilter(e.target.value) }} />}
				</div>
			</div>
			<div className={show ? 'sm:block lg:hidden w-full h-screen fixed top-0 left-0 bg-white Nunito duration-300 zindex2000' : 'zindex2000 sm:block w-full h-screen fixed top-0 left-full bg-white Nunito duration-300'}>
				<div className='absolute top-5 right-5 p-3 bg-gray-200 bg-opacity-50 rounded-full' onClick={() => { setShow(false) }}><MdOutlineClose /></div>
				<div className='flex flex-col w-full justify-evenly h-5/6 text-center font-bold text-lg mt-8'>
					{router.pathname.includes('main') && <input type="text" className='outline-none w-full h-full' placeholder='Search Campaign, User, Email' value={filter} onChange={(e) => { setFilter(e.target.value) }} />}
				</div>
			</div>
		</>
	)
}

export default Topbar