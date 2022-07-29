import React from 'react'
import { useAuthContext } from '../context/Auth'
import Alert from './Alert'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

const Ui = ({ show, setShow }) => {
	const { alert } = useAuthContext()
	return (
		<>
			<div className='fixed top-0 left-0 w-full bg-gradient-top h-11 z-20'></div>
			<Topbar setShow={setShow} show={show} />
			<Sidebar setShow={setShow} />
			<Alert text={alert} />
		</>
	)
}

export default Ui