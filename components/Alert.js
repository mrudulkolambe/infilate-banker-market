import React from 'react'

const Alert = ({text}) => {
  return (
	<>
		<div className={text && text.length >= 0 ? "Nunito duration-300 h-12 bg-gray-800 fixed bottom-0 w-full zindexMax text-white py-3 px-12": "Nunito duration-300 h-12 bg-gray-800 fixed -bottom-12 w-full zindexMax text-white py-3 px-12"}>{text && text}</div>
	</>
  )
}

export default Alert