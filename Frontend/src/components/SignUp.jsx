import React from 'react'
import { useState } from 'react'
import {useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from "react-router";
import { ChatState } from '../Context/ChatProvider';

function SignUp() {
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [Cpassword, setCpassword] = useState(null)
  const toast=useToast();
  const [loading ,setLoading]=useState(false);
  const [pic, setPic] = useState()
  const history=useHistory();
  const {setUser}=ChatState();


  const handleSubmit=async (e)=>{
    setLoading (true);
    e.preventDefault();
    if(!name||!email||!password){
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if(password!=Cpassword){
      toast({
        title: "Password do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    const config={
      header:{
        "Content-Type":"application/json",
      },
    };
    try{
      const { data } = await axios.post("http://localhost:3000/api/user/registration", {
        name,
        email,
        password,
        pic
      }, config)
      console.log(data);
      toast({
        title: "Registration Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push('/chats')
    }catch(error){
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }
  }

  const postDetail=(pic)=>{
    setLoading(true);
    if(pic===undefined){
      toast({
        title: "Please Select the Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    console.log(pic);
    if(pic.type==='/image/jpeg'||pic.type==='/image/png'){
      const data=new FormData
      data.append('file','pic')
      data.append('upload_preset','Chat App')
      data.append('cloud_name','dzpltmv9i')

      fetch('https://api.cloudinary.com/v1_1/dzpltmv9i/image/upload',{
        method:"post",
        body:data
      }).then((res)=>{res.json}).then((data)=>{setPic(data.url.toString)
        console.log(data.url.toString);
        setLoading(false)
      })
    }
    else{
      toast({
        title: "Please Select the Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    
  }

  return (
    <>
      <div className='signup flex'>
        <form onSubmit={handleSubmit} action="" className='flex flex-col m-5 w-full'>
          <label className='text-xl' htmlFor="name">Name</label>
          <input onChange={(e)=>setName(e.target.value)} className='w-full h-9 mt-2 rounded-md' id='name' type="text" required />
          <label className='text-xl' htmlFor="email">Email</label>
          <input onChange={(e)=>setEmail(e.target.value)} className='w-full h-9 mt-2 rounded-md' id='email' type="email" required />
          <label className='text-xl' htmlFor="password">Password</label>
          <input onChange={(e)=>setPassword(e.target.value)} className='w-full h-9 mt-2 rounded-md' id='password' type="password" required />
          <label className='text-xl' htmlFor="confirmPassword">Confirm Password</label>
          <input onChange={(e) => {setCpassword(e.target.value)}} className='w-full h-9 mt-2 rounded-md' id='confirmPassword' type="password" required />
          <label className='text-xl' htmlFor="file">Upload your picture</label>
          <input onClick={(e)=>{postDetail(e.target.files[0])}} className='w-full h-9 mt-2 rounded-md' id='file' type="file"/>
          <button   className='bg-blue-800 w-full h-10 text-xl rounded-md mt-7'>Sign Up</button>
        </form>
      </div>
    </>
  )
}

export default SignUp
