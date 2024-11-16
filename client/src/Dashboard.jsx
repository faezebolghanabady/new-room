import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [message , setMessage] = useState()
    const navigate = useNavigate()
    axios.defaults.withCredentials = true
    useEffect(()=>{
        axios.get('http://127.0.0.1:3000/dashboard')
        .then(res => {
            if(res.data.valid){
                setMessage(res.data.message)
            }else{
                navigate('/')
            }
        })
    })
  return (
    <h2>welcome to dashboard{message}</h2>
  )
}

export default Dashboard