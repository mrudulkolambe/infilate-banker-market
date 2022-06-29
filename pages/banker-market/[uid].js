import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdOutlineClose } from 'react-icons/md'
import Spinner from '../../components/Spinner'
import { useRouter } from 'next/router'
import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuthContext } from '../../context/Auth'
import { db } from '../../context/firebase_config'
import { useCampaignUpload } from '../../context/store'
import BankerMarketCampaignCard from '../../components/BankerMarketCampaignCard'

const BankerMarket = () => {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { setAlert } = useAuthContext()
	const { campaignData } = useCampaignUpload()
	const [adminData, setAdminData] = useState()
	const [currentCampaign, setCurrentCampaign] = useState()
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [contact, setContact] = useState('')
	const [trackingLink, setTrackingLink] = useState('')
	const [pincode, setPincode] = useState('')
	console.log(currentCampaign)
	useEffect(() => {
		if (router && router.query.uid) {
			const unsub = onSnapshot(doc(db, "publisher_database", router.query.uid), (doc) => {
				setAdminData(doc.data())
				console.log(doc.data())

			});
			return () => {
				unsub()
			};
		}
	}, [router]);

	useEffect(() => {
		if (currentCampaign) {
			let item = Object.values(adminData.trackingURLs).filter(handleFilter)
			console.log(item)
			if (item && item[0] && item[0].trackingLink) {
				setTrackingLink(item[0].trackingLink)
			} else {
				setCurrentCampaign()
				setAlert('Cannot apply for the campaign right now!, Contact with the admin')
			}
		}
	}, [currentCampaign, adminData]);

	const handleFilter = (item) => {
		if (item.campaignId === currentCampaign.id) {
			return true
		} else {
			return false
		}
	}

	const handleSubmit = async () => {
		if (adminData) {
			if (name.length > 0 && pincode.length > 0 && email.length > 0 && contact.length > 0 && router.query.uid.length > 0 && currentCampaign) {
				setLoading(true)
				addDoc(collection(db, "banker_data"), {
					name: name,
					phone: contact,
					email: email,
					pincode: pincode,
					publisher_uid: router.query.uid,
					publisher_name: adminData.username,
					publisher_email: adminData.email,
					campaign: currentCampaign,
					redirection: trackingLink,
				})
					.then(() => {
						setLoading(false)
						setEmail('')
						setName('')
						setContact('')
						setPincode('')
						setCurrentCampaign()
						setTimeout(() => {
							window.open(trackingLink)
						}, 2000);
						setAlert('You have successfully applied for Banker Market!')
						alert('You have successfully applied for Banker Market!')

					})
					.catch(() => {
						setAlert('Something went wrong!');
						alert('Something went wrong!')
						setLoading(false)
					})
			} else {
				setAlert('Fill the details properly')
				alert('Fill the details properly')
				setLoading(false)
			}
		}
		else {
			setAlert('Something went wrong!')
			alert('Something went wrong!')
			setLoading(false)
		}
	}
	return (
		<>
			<div className='hidden lg:block pt-3 Nunito w-full h-calc-height-half overflow-scroll absolute top-20'>
				<h1 className='font-bold text-5xl text-center pb-3'>Banker Market</h1>
				<div className='flex px-10 justify-between items-center w-full'>
					<div className='font-bold'>{adminData && adminData.username}</div>
					<div>
						<a href={`tel:${adminData && adminData.phone}`}>Contact</a>
					</div>
				</div>
				<div className='flex h-full mt-16 px-10'>
					<div className='w-6/12 p-5 rounded-lg border'>
						<img src={currentCampaign && currentCampaign.img || 'https://img.freepik.com/free-photo/gray-concrete-textured-wall_53876-94016.jpg?t=st=1655672963~exp=1655673563~hmac=f1d4ea077dbb8ffd5d615acdf6c951c74231783aba4773ce9173c91a3389f523&w=1060'} className='m-auto h-48 aspect-video rounded-lg' alt="" />
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='name' className='font-bold text-gray-600 cursor-pointer'>Full Name</label>
							<input id='name' onChange={(e) => { setName(e.target.value) }} value={name} className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="text" placeholder='John Doe' />
						</div>
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='email' className='font-bold text-gray-600 cursor-pointer'>Contact Number</label>
							<input onChange={(e) => { setContact(e.target.value) }} value={contact} className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="text" placeholder='9876543210' />
						</div>
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='password' className='font-bold text-gray-600 cursor-pointer'>Email Address</label>
							<input onChange={(e) => { setEmail(e.target.value) }} value={email} id='password' className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="email" placeholder='eg. user@gmail.com' />
						</div>
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='password' className='font-bold text-gray-600 cursor-pointer'>Pincode</label>
							<input onChange={(e) => { setPincode(e.target.value) }} value={pincode} id='password' className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="text" placeholder='********' />
						</div>
						<div>
							<button onClick={handleSubmit} disabled={loading} className='flex items-center justify-center text-white font-bold bg-gray-900 duration-200 px-3 py-2 rounded-lg hover:bg-gray-700 mt-5 w-full'>{loading ? <Spinner /> : 'Apply'}</button>
						</div>
					</div>
					<div className='w-6/12 pl-5 grid grid-cols-3 gap-y-5 cursor-pointer overflow-scroll h-calc-height pb-6 min-height-banker-container'>
						{
							campaignData && campaignData.map((data, i) => {
								return <BankerMarketCampaignCard key={i} data={data} setCurrentCampaign={setCurrentCampaign} />
							})
						}
					</div>
				</div>
			</div>


			<div className='sm:block lg:hidden pt-3 Nunito w-full h-calc-height-half overflow-scroll absolute top-20 flex flex-col'>
				<h1 className='font-bold text-5xl text-center pb-3'>Banker Market</h1>
				<div className='flex px-10 justify-between items-center w-full'>
					<div className='font-bold'>{adminData && adminData.username}</div>
					<div>
						<a href={`tel:${adminData && adminData.phone}`}>Contact</a>
					</div>
				</div>
				<div className='flex w-full mt-16 px-5 flex-col'>
					<div className='w-full p-5 rounded-lg border'>
						<img src={currentCampaign && currentCampaign.img || 'https://img.freepik.com/free-photo/gray-concrete-textured-wall_53876-94016.jpg?t=st=1655672963~exp=1655673563~hmac=f1d4ea077dbb8ffd5d615acdf6c951c74231783aba4773ce9173c91a3389f523&w=1060'} className='m-auto h-48 aspect-video rounded-lg' alt="" />
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='name' className='font-bold text-gray-600 cursor-pointer'>Full Name</label>
							<input id='name' onChange={(e) => { setName(e.target.value) }} value={name} className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="text" placeholder='John Doe' />
						</div>
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='email' className='font-bold text-gray-600 cursor-pointer'>Contact Number</label>
							<input onChange={(e) => { setContact(e.target.value) }} value={contact} className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="text" placeholder='9876543210' />
						</div>
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='password' className='font-bold text-gray-600 cursor-pointer'>Email Address</label>
							<input onChange={(e) => { setEmail(e.target.value) }} value={email} id='password' className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="email" placeholder='eg. user@gmail.com' />
						</div>
						<div className='flex flex-col items-start mt-3'>
							<label htmlFor='password' className='font-bold text-gray-600 cursor-pointer'>Pincode</label>
							<input onChange={(e) => { setPincode(e.target.value) }} value={pincode} id='password' className='w-full mt-1 outline-none py-3 px-5 border border-gray-500 font-semibold rounded-lg' type="text" placeholder='********' />
						</div>
						<div>
							<button onClick={handleSubmit} disabled={loading} className='flex items-center justify-center text-white font-bold bg-gray-900 duration-200 px-3 py-2 rounded-lg hover:bg-gray-700 mt-5 w-full'>{loading ? <Spinner /> : 'Apply'}</button>
						</div>
					</div>
					<div className='mt-12 w-full grid grid-cols-1 gap-y-3 cursor-pointer overflow-scroll h-calc-height pb-6 min-height-banker-container'>
						{
							campaignData && campaignData.map((data, i) => {
								return <BankerMarketCampaignCard key={i} data={data} setCurrentCampaign={setCurrentCampaign} />
							})
						}
					</div>
				</div>
			</div>

		
		</>
	)
}

export default BankerMarket