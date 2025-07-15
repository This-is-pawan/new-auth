import React from 'react'
import { Link } from 'react-router'

const Home = () => {
  return (
    <div className='relative top-10 p-5 '>
      <div className='relative'>
        <h1 className='text-4xl text-center absolute top-40 left-0 right-0 font-bold '> 👋🏻Hey developers {''}</h1>
        <p className='text-xl text-center absolute top-[14rem] left-0 right-0'>welcome my dear user and our service is provide of ui/ux desning and server serivce also provided and tieup with big company.</p>
      <Link to='/login'><button className='w-40 m-auto p-3 tracking-wide cursor-pointer bg-black text-white rounded-full text-xl text-center absolute top-[21rem] left-0 right-0'>explore more</button></Link>

      </div>
    </div>
  )
}

export default Home
