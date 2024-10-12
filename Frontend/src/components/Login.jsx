import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { useHistory } from "react-router";
import { ChatState } from '../Context/ChatProvider';


function Login() {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const toast=useToast();
  const history=useHistory();
  const {setUser}=ChatState();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!email||!password){
      toast({
        title: "Input all the Field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try{
      const config={
        header:{
          "content-Type":"application/json"
        }
      }
      const {data} = await axios.post('http://localhost:3000/api/user/login',{email,password},config)
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data)
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push('/chats')
    }catch(error){
      toast({
        title: "User does not exist",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
    }

  }
  return (
    <>
          <div className='login flex'>
        <form onSubmit={handleSubmit} action="" className='flex flex-col m-5 w-full'>
                  <label className='text-xl' htmlFor="email">Email Address</label>
                  <input onChange={(e)=>setEmail(e.target.value)} className='w-full h-9 mt-2 rounded-md' id='email' type="email" required />
                  <label className='text-xl mt-4' htmlFor="password">Password</label>
                  <input onChange={(e)=>{setPassword(e.target.value)}} className='w-full h-9 mt-2 rounded-md' id='password' type="password" required />
                  <div className='flex flex-col mt-7'>
                      <button className='bg-blue-800 w-full h-10 text-xl rounded-md'>Login</button>
                      <button className='bg-red-600 w-full h-10 text-xl mt-4 rounded-md'>Get Guest User Credential</button>
                  </div>
              </form>
          </div>
    </>
  )
}

export default Login
