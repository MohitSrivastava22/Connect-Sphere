import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { useHistory } from "react-router";
import { ChatState } from '../Context/ChatProvider';

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const toast = useToast();
  const history = useHistory();
  const { backendUrl, setUser } = ChatState();

  const loginUser = async (loginEmail, loginPassword) => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Input all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        { email: loginEmail, password: loginPassword },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push('/chats');
    } catch (error) {
      toast({
        title: "User does not exist",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  const handleGuestLogin = () => {
    loginUser("xyza@gmail.com", "123456789");
  };

  return (
    <div className='login flex'>
      <form onSubmit={handleSubmit} className='flex flex-col m-5 w-full bg-slate-50'>
        <label className='text-xl' htmlFor="email">Email Address</label>
        <input onChange={(e) => setEmail(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg' id='email' type="email" required placeholder='Enter your email' />
        <label className='text-xl mt-4' htmlFor="password">Password</label>
        <input onChange={(e) => setPassword(e.target.value)} className='w-full h-10 mt-2 px-3 py-2 rounded-md bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg' id='password' type="password" required placeholder='Enter your password'/>
        <div className='flex flex-col mt-7'>
          <button className='bg-blue-500 w-full h-10 text-xl rounded-md'>Login</button>
          <button type='button' onClick={handleGuestLogin} className='bg-red-500 w-full h-10 text-xl mt-4 rounded-md'>
            Explore as Guest
          </button>
        </div>
      </form>
    </div>
  );
}
export default Login;