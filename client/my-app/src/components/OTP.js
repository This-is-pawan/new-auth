import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const OTP = () => {
  const navigate = useNavigate()

  const [one, setOne] = useState('')
  const [two, setTwo] = useState('')
  const [three, setThree] = useState('')
  const [four, setFour] = useState('')
  const [five, setFive] = useState('')
  const [six, setSix] = useState('')

  // When all inputs are filled, submit automatically
  useEffect(() => {
    if (one && two && three && four && five && six) {
      handlesumbit()
    }
  }, [one, two, three, four, five, six])

  const handlesumbit = async (e) => {

    const otp = one + two + three + four + five + six
    axios.defaults.withCredentials = true

    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/verifyuser',
        { otp },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (data.success) {
        toast.success('Verified successfully' || data.message)
        navigate('/dashboard')
      } else {
        toast.error('Not verified' || data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Server error')
    }
  }

  return (
    <div className='w-full max-w-[400px] m-auto relative top-20 '>
      <div className='shadow bg-pink-100 text-center p-20 rounded-full'>
        <h1 className='text-2xl font-bold'>Verify User</h1>
        <form className='flex justify-center'>
          <input maxLength={1} type="text" className='m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400'
            onChange={(e) => setOne(e.target.value)} />
          <input maxLength={1} type="text" className='m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400'
            onChange={(e) => setTwo(e.target.value)} />
          <input maxLength={1} type="text" className='m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400'
            onChange={(e) => setThree(e.target.value)} />
          <input maxLength={1} type="text" className='m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400'
            onChange={(e) => setFour(e.target.value)} />
          <input maxLength={1} type="text" className='m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400'
            onChange={(e) => setFive(e.target.value)} />
          <input maxLength={1} type="text" className='m-2 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-800 text-center to-pink-400'
            onChange={(e) => setSix(e.target.value)} />
        </form>
      </div>
    </div>
  )
}

export default OTP
