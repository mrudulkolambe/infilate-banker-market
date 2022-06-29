import React from 'react'

const BankerCard = ({ data }) => {
	return (
		<>
			<div className='border rounded-lg shadow-lg p-4 w-full mx-3'>
				<div className='mb-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>Name: <span className='font-bold'>{data.name}</span></div>
				<div className='mb-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>Contact No.: <span className='font-bold'>{data.phone}</span></div>
				<div className='mb-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>Email: <span className='font-bold'>{data.email}</span></div>
				<div className='mb-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>Pincode: <span className='font-bold'>{data.pincode}</span></div>
				<div className='mb-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>Campaign: <span className='font-bold'>{data.campaign.campaign_name}</span></div>
			</div>
		</>
	)
}

export default BankerCard