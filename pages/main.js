import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Spinner from '../components/Spinner'
import { useRouter } from 'next/router'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuthContext } from '../context/Auth'
import BankerCard from '../components/BankerCard'
import { db } from '../context/firebase_config'

const BankerMarket = () => {
	const [loading, setLoading] = useState(false)
	const [url, setURL] = useState('')
	const [btn, setBtn] = useState('Copy!')
	const router = useRouter()
	const { userData, setAlert, filter } = useAuthContext()
	const [bankerData, setBankerData] = useState()
	const [searchBankerData, setSearchBankerData] = useState(bankerData && bankerData)

	useEffect(() => {
		if (filter.length === 0) {
			setSearchBankerData(bankerData && bankerData)
		} else {
			let arr = [];
			bankerData && bankerData.forEach((data) => {
				if (data.email.toLowerCase().includes(filter.toLowerCase()) || data.name.toLowerCase().includes(filter.toLowerCase()) || data.campaign.campaign_name.toLowerCase().includes(filter.toLowerCase())) {
					arr.push(data)
				}
			})
			setSearchBankerData(arr)
		}
	}, [filter, bankerData])


	useEffect(() => {
		if (userData) {
			setURL(`${window.location.origin}/banker-market/${userData && userData.uid}`)
			const q = query(collection(db, "banker_data"), where("publisher_uid", "==", userData.uid));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const arr = [];
				querySnapshot.forEach((doc) => {
					let obj = doc.data()
					obj.id = doc.id
					arr.push(obj);
				});
				setBankerData(arr)
			});
		}
	}, [userData]);

	const copyFunc = () => {
		setBtn('Copied!');
		window.navigator.clipboard && window.navigator.clipboard.writeText(url)
		setAlert('Link Copied!')
		setTimeout(() => {
			setBtn('Copy!')
		}, 1000);
	}
	return (
		<>
			<div className='hidden lg:block absolute px-5 py-6 Nunito justify-center items-center h-calc-height w-10/12 left-position top-24'>
				<h1 className='text-5xl font-bold text-center'>Banker Market</h1>
				<div className='mt-8 flex items-center'>
					<label>Banker URL: </label>
					<div className='relative'>
						<input type="text" className='outline-none cursor-pointer ml-4 px-4 py-2 rounded-lg w-96 border-2' value={url} readOnly />
						<button onClick={copyFunc} className='hover:bg-blue-500 duration-300 ml-3 font-bold text-white px-2 py-1 w-20 bg-blue-600 rounded-lg'>{btn}</button>
					</div>
				</div>

				<div className='mt-8'>
					<h1 className='font-bold text-3xl'>Data: </h1>
					<div className='grid mt-3 gap-y-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center pb-10'>
						{
							searchBankerData && searchBankerData.map((data, i) => {
								return <BankerCard key={i} data={data} />
							})
						}
					</div>
				</div>
			</div>



			<div className='md:block sm:block lg:hidden absolute top-20 px-3 pt-6 Nunito w-full h-calc-height overflow-scroll'>
				<h1 className='text-3xl font-bold text-center'>Banker Market</h1>
				<div className='mt-8 flex justify-center flex-col w-11/12 items-start'>
					<label>Banker URL: </label>
					<div className='relative'>
						<input type="text" className='outline-none cursor-pointer px-4 py-2 rounded-lg w-full border-2' value={url} readOnly />
						<button onClick={copyFunc} className='mt-3 hover:bg-blue-500 duration-300 m-auto font-bold text-white px-2 py-1 w-20 bg-blue-600 rounded-lg'>{btn}</button>
					</div>
				</div>

				<div className='mt-8'>
					<h1 className='font-bold text-3xl'>Data: </h1>
					<div className='grid mt-3 gap-y-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center mb-3'>
						{
							bankerData && bankerData.map((data, i) => {
								return <BankerCard key={i} data={data} />
							})
						}
					</div>
				</div>

			</div>
		</>
	)
}

export default BankerMarket