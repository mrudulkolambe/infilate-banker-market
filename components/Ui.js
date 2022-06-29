import React from 'react'
import { useAuthContext } from '../context/Auth'
import Alert from './Alert'

const Ui = () => {
	const { alert } = useAuthContext()
	return (
		<>
			<div className='fixed top-0 left-0 w-full bg-gradient-top h-11 z-20'></div>
			<Alert text={alert} />
		</>
	)
}

export default Ui