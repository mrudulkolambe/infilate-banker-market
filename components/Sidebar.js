import React, { useState } from "react";
import { FaRegLifeRing, FaBars } from "react-icons/fa";
import { useAuthContext } from "../context/Auth";
import Link from 'next/link'
import Alert from "./Alert";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import Spinner from "./Spinner";
import InfilateLogo from './InfilateLogo'
import { db } from "../context/firebase_config";

const Sidebar = ({ setShow, show }) => {
  const [showMenu, setShowMenu] = useState(show);
  const { userData, alert, handleSignOut, POC, setAlert } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleBankerMarket = async () => {
    if (userData) {
      setLoading(true)
      const docRef = doc(db, "publisher_database", userData.uid);
      await updateDoc(docRef, {
        appliedBanker: true
      })
        .then(() => {
          setAlert('You have been successfully applied for banker market!');
        })
        .catch(() => {
          setAlert('Something went wrong')
        })
    }

  }
  return (
    <>
      <Alert text={alert} />
      <div className={router.pathname.includes('banker-market') ? 'overflow-hidden lg:block hidden fixed w-2/12 h-screen py-3 pt-0 Nunito top-6 rounded-tl-3xl zindex2000' : 'overflow-hidden lg:block hidden fixed w-2/12 border-r shadow-xl h-screen py-3 pt-0 Nunito top-6 rounded-tl-3xl zindex2000'}>
        <div className={router.pathname.includes('banker-market') ? "flex items-center h-20 justify-center bg-white shadow-lg" : 'flex items-center h-20 justify-center bg-white'}>
          <h1 className="font-bold text-5xl text-center"><InfilateLogo /></h1>
        </div>
        <div className={router.pathname.includes('banker-market') ? 'hidden' : 'bg-transparent'}>
          <div className="flex flex-col items-center mt-8">
            <img
              className="h-40 rounded-lg overflow-hidden aspect-square"
              src={userData && userData.photoURL || "https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg"}
            />
            <h2 className="mt-3 font-bold">{userData && userData.email}</h2>
            {
              userData ? <button onClick={() => { router.push('/profile-edit') }} className="w-7/12 font-bold py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 duration-200 mt-5">
                Edit
              </button> : null
            }
            <button className="w-7/12 font-bold py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 duration-200 mt-4 flex items-center justify-center">
              <FaRegLifeRing />
              <p className="ml-2">Support</p>
            </button>
            {userData ? <button onClick={handleSignOut} className="w-7/12 font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 duration-200 mt-4">
              Logout
            </button>
              : <Link href={'/'}>
                <span className="text-center w-7/12 font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 duration-200 mt-4">
                  Sign In
                </span>
              </Link>
            }
            {
              userData ? <div className="mt-12 w-full px-2">
                <h1 className="font-bold text-center text-lg">POC</h1>
                <p className="text-left font-bold mt-3">Name: <span className="font-normal">{POC && POC.name}</span></p>
                <p className="text-left font-bold">Email: <span className="font-normal">{POC && POC.email}</span></p>
                <p className="text-left font-bold">Phone: <span className="font-normal">{POC && POC.phone}</span></p>
              </div>
                : null
            }
          </div>
        </div>
      </div>

      <div className='fixed left-0 top-0 px-4 md:px-12 flex items-center justify-between Nunito lg:hidden h-20 bg-red-400 w-full zindex1000'>
        <div className="flex items-center"><FaBars className="mr-4" onClick={() => { setShow(true) }} /><h1 className="text-3xl font-bold">Infilate</h1></div>
        <div className="relative">
          <img className="h-10 w-10 rounded-full" src={userData && userData.photoURL || "https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg"} alt="" onClick={() => { showMenu ? setShowMenu(false) : setShowMenu(true) }} />
          <div className={showMenu ? 'origin-top-right absolute top-full mt-2 rounded-lg shadow-lg right-2/3 w-48 p-3 bg-white scale-100 duration-300' : 'origin-top-right absolute top-full mt-2 rounded-lg shadow-lg right-2/3 w-48 p-3 bg-gray-300 scale-0 duration-300'}>
            {userData ? <button className="w-full font-bold py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 duration-200 my-2 mt-0">
              Edit
            </button> : null}
            <button className="w-full font-bold py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 duration-200 my-2 mt-0 flex items-center justify-center">
              <FaRegLifeRing />
              <p className="ml-2">Support</p>
            </button>
            {
              userData ? <button className="w-full font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 duration-200 mt-0">
                Logout
              </button> : <Link href={'/'}>
                <span className="w-full font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 duration-200 mt-0">
                  Sign In
                </span>
              </Link>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
