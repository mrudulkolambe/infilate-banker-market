import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../context/Auth'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import Spinner from '../components/Spinner'
import { useRouter } from 'next/router'
import { updateProfile } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../context/firebase_config'
import { doc, updateDoc } from 'firebase/firestore'

const ProfileEdit = () => {
	const storage = getStorage();
	const imageInput = useRef()
	const { user, setAlert } = useAuthContext()
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const [name, setName] = useState(user && user.displayName)
	const [phone, setPhone] = useState(user && user.phone)
	const [photo, setPhoto] = useState(user && user.photoURL)
	useEffect(() => {
		if (user) {
			setName(user.displayName)
			setPhoto(user.photoURL)
			setPhone(user.phone)
		}
	}, [user]);
	const handleUpdate = async () => {
		updateProfile(user, {
			displayName: name,
			phoneNumber: phone.toString()
		})
		const docRef = doc(db, "publisher_database", user.uid);
		await updateDoc(docRef, {
			phone: phone,
			name: name,
			photoURL: photo,
		}).then(() => {
			setAlert('Profile Updated!')
		}).catch((error) => {
			setAlert('Something went wrong!')
		});


	}
	const handleImgUpload = async (e) => {
		if (user) {
			const storageRef = ref(storage, `users/${user.uid}.jpg`);
			console.log(storageRef)
			const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
			uploadTask.on('state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				},
				(error) => {
					// Handle unsuccessful uploads
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						updateProfile(user, {
							photoURL: downloadURL
						}).then( async () => {
							const docRef = doc(db, "publisher_database", user.uid);
							await updateDoc(docRef, {
								photoURL: photo,
							}).then(() => {
								setAlert('Profile Updated!')
							}).catch((error) => {
								setAlert('Something went wrong!')
							});
							setPhoto(user.photoURL)
						}).catch((error) => {
							setAlert('Something went wrong!')
						});
					});
				}
			);
		}
	}
	return (
		<>
			<div className='hidden lg:block left-position absolute top-24 mt-2 px-10 py-6 Nunito w-10/12 bg-white z-20'>
				<div className='flex items-center cursor-pointer mt-7' onClick={() => { router.back() }}><MdKeyboardArrowLeft className='mr-1 text-3xl' />  Back to Home page</div>
				<div className='flex mt-6 sticky'>
					<div className='px-2 w-3/12'>
						<div className='flex flex-col items-center'>
							<img className='aspect-square h-5/6 rounded-lg shadow-lg' src={user ? user.photoURL : "https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg"} alt="" />
							<input onChange={handleImgUpload} type="file" accept='image/png, image/jpg, image/jpeg' className='hidden' ref={imageInput} />
							<button disabled={loading} onClick={() => { imageInput.current.click() }} className='px-3 py-1 bg-gray-900 rounded-lg text-white font-bold hover:bg-gray-700 duration-200 mt-3 flex items-center'>{loading ? <Spinner /> : 'Upload'}</button>
							<h1 className='mt-5 text-3xl font-bold text-center'>{user && user.displayName}</h1>
						</div>
					</div>
					<div className='px-2 w-9/12'>
						<div className='flex'>
							<div className='mx-1 px-8 rounded-lg py-4 w-3/12 font-bold text-2xl'>Email : </div>
							<div className='mx-1 px-8 rounded-lg py-4 w-9/12 font-bold text-2xl'>{user && user.email}</div>
						</div>
						<div className='flex mt-4'>
							<div className='mx-1 px-8 rounded-lg py-4 w-3/12 font-bold text-2xl'>Phone : </div>
							<input onChange={(e) => { setPhone(e.target.value) }} className='mx-1 px-8 rounded-lg py-4 w-9/12 font-bold text-2xl outline-none border-b' placeholder='Phone' value={phone} />
						</div>
						<div className='flex mt-4'>
							<div className='mx-1 px-8 rounded-lg py-4 w-3/12 font-bold text-2xl'>Name</div>
							<input onChange={(e) => { setName(e.target.value) }} className='mx-1 px-8 rounded-lg py-4 w-9/12 font-bold text-2xl outline-none border-b' placeholder='Name' value={name} />
						</div>
						<div className='flex mt-4'>
							<div className='mx-1 px-8 rounded-lg py-4 w-3/12 font-bold text-2xl'>User Id : </div>
							<div className='mx-1 px-8 rounded-lg py-4 w-9/12 font-bold text-2xl'>{user && user.uid}</div>
						</div>
						<div className='mt-5 w-full flex justify-center'>
							<button onClick={handleUpdate} className='bg-gray-900 text-white font-bold rounded-lg duration-300 hover:bg-gray-700 px-3 py-1'>Update</button>
						</div>
					</div>
				</div>
			</div>

			<div className='lg:hidden sm:block absolute top-20 px-7 py-3 Nunito w-full bg-white z-20'>
				<div className='flex items-center cursor-pointer mt-4' onClick={() => { router.back() }}><MdKeyboardArrowLeft className='mr-1 text-3xl' />  Back to campaign list</div>
				<div className='flex flex-col mt-6'>
					<div className='px-2 w-full'>
						<div className='flex flex-col items-center'>
							<img className='h-4/6 md:h-3/6 aspect-square overflow-hidden' src="https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg" alt="" />
							<h1 className='mt-4 text-3xl font-bold text-center'>Python</h1>
						</div>
					</div>
					<div className='w-full'>
						<div className='flex flex-col'>
							<div className='my-1  px-8 rounded-lg py-4 w-full '>Email :</div>
							<div className='my-1  px-8 rounded-lg py-4 w-full'>{user && user.email}</div>
						</div>
						<div className='flex flex-col'>
							<div className='my-1  px-8 rounded-lg py-4 w-full '>Phone :</div>
							<input onChange={(e) => { setPhone(e.target.value) }} className='my-1  px-8 rounded-lg py-4 w-full bg-red-300' value={phone} />
						</div>
						<div className='flex mt-4 flex-col'>
							<div className='my-1  px-8 rounded-lg py-4 w-full bg-red-300'>Name</div>
							<input onChange={(e) => { setName(e.target.value) }} className='my-1  px-8 rounded-lg py-4 w-full bg-red-300' value={name} />
						</div>
						<div className='flex flex-col'>
							<div className='my-1  px-8 rounded-lg py-4 w-full '>User Id :</div>
							<div className='my-1  px-8 rounded-lg py-4 w-full'>{user && user.uid}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProfileEdit