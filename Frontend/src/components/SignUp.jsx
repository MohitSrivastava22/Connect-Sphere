// import React from 'react'
// import { useState } from 'react'
// import {useToast } from '@chakra-ui/react'
// import axios from 'axios'
// import { useHistory } from "react-router";
// import { ChatState } from '../Context/ChatProvider';

// function SignUp() {
//   const [name, setName] = useState(null)
//   const [email, setEmail] = useState(null)
//   const [password, setPassword] = useState(null)
//   const [Cpassword, setCpassword] = useState(null)
//   const toast=useToast();
//   const [loading ,setLoading]=useState(false);
//   const [pic, setPic] = useState()
//   const history=useHistory();
//   const {setUser}=ChatState();


//   const handleSubmit=async (e)=>{
//     setLoading (true);
//     e.preventDefault();
//     if(!name||!email||!password){
//       toast({
//         title: "Please Fill all the Feilds",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setLoading(false);
//       return;
//     }
//     if(password!=Cpassword){
//       toast({
//         title: "Password do not match",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setLoading(false);
//       return;
//     }
//     const config={
//       header:{
//         "Content-Type":"application/json",
//       },
//     };
//     try{
//       const { data } = await axios.post("http://localhost:3000/api/user/registration", {
//         name,
//         email,
//         password,
//         pic
//       }, config)
//       console.log(data);
//       toast({
//         title: "Registration Successfull",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       setLoading(false);
//       setUser(data);
//       localStorage.setItem("userInfo", JSON.stringify(data));
//       history.push('/chats')
//     }catch(error){
//       toast({
//         title: "Error Occured!",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setLoading(false)
//     }
//   }

//   const postDetail=async (pic)=>{
//     setLoading(true);
//     if(pic===undefined){
//       toast({
//         title: "Please Select the Image",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setLoading(false);
//       return;
//     }
//     console.log(pic);
//     if(pic.type==='image/jpeg'||pic.type==='image/png'){
//       const data=new FormData()
//       data.append('file',pic)
//       data.append('upload_preset','chat_app')
//       data.append('cloud_name','dzpltmv9i')

//       await fetch('https://api.cloudinary.com/v1_1/dzpltmv9i/image/upload',{
//         method:"POST",
//         body:data
//       }).then((res)=>res.json()).then((data)=>{setPic(data.url)
//         // console.log(data.url.toString);
//         setLoading(false)
//       })
//     }
//     else{
//       toast({
//         title: "Please Select the Image",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
    
//   }

//   return (
//     <>
//       <div className='signup flex bg-slate-50'>
//         <form onSubmit={handleSubmit} action="" className='flex flex-col m-auto w-full'>
//           <label className='text-xl mt-2' htmlFor="name">Name</label>
//           <input onChange={(e) => setName(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='name' type="text" required placeholder='Enter your name' />
//           <label className='text-xl mt-2' htmlFor="email">Email</label>
//           <input onChange={(e) => setEmail(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='email' type="email" required placeholder='Enter your email' />
//           <label className='text-xl mt-2' htmlFor="password">Password</label>
//           <input onChange={(e) => setPassword(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='password' type="password" required placeholder='Enter your password'/>
//           <label className='text-xl mt-2' htmlFor="confirmPassword">Confirm Password</label>
//           <input onChange={(e) => { setCpassword(e.target.value) }} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='confirmPassword' type="password" required placeholder='Enter your password'/>
//           <label className='text-xl mt-2' htmlFor="file">Upload your picture</label>
//           <input onChange={(e) => { postDetail(e.target.files[0]) }} className='w-full h-10 mt-2 px-2 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='file' type="file" placeholder='Upload your picture'/>
//           <button className='bg-blue-500 w-full h-10 text-xl rounded-md mt-7'>Sign Up</button>
//         </form>
//       </div>
//     </>
//   )
// }

// export default SignUp







import React from 'react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from "react-router";
import { ChatState } from '../Context/ChatProvider';

function SignUp() {
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [Cpassword, setCpassword] = useState(null)
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState()
  const history = useHistory();
  const { setUser } = ChatState();


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!name || !email || !password) {
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
    if (password != Cpassword) {
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
    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };
    try {
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
    } catch (error) {
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

  const postDetail = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
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
    console.log("pic pic",pic);
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData()
      data.append('file', pic)
      data.append('upload_preset', 'chat_app')
      data.append('cloud_name', 'dzpltmv9i')

      const res=await fetch('https://api.cloudinary.com/v1_1/dzpltmv9i/image/upload', {
        method: "POST",
        body: data})
      const resData = await res.json();
      setPic(resData.url);
      setLoading(false);
    }
    else {
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
      <div className='signup flex bg-slate-50'>
        <form onSubmit={handleSubmit} action="" className='flex flex-col m-auto w-full'>
          <label className='text-xl mt-2' htmlFor="name">Name</label>
          <input onChange={(e) => setName(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='name' type="text" required placeholder='Enter your name' />
          <label className='text-xl mt-2' htmlFor="email">Email</label>
          <input onChange={(e) => setEmail(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='email' type="email" required placeholder='Enter your email' />
          <label className='text-xl mt-2' htmlFor="password">Password</label>
          <input onChange={(e) => setPassword(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='password' type="password" required placeholder='Enter your password' />
          <label className='text-xl mt-2' htmlFor="confirmPassword">Confirm Password</label>
          <input onChange={(e) => { setCpassword(e.target.value) }} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='confirmPassword' type="password" required placeholder='Enter your password' />
          <label className='text-xl mt-2' htmlFor="file">Upload your picture</label>
          <input onChange={(e) => { postDetail(e.target.files[0]) }} className='w-full h-10 mt-2 px-2 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-403 placeholder:text-lg' id='file' type="file" placeholder='Upload your picture' />
          <button className='bg-blue-500 w-full h-10 text-xl rounded-md mt-7'>Sign Up</button>
        </form>
      </div>
    </>
  )
}

export default SignUp




