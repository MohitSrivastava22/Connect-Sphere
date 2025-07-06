import { useState,useEffect } from 'react'
import React from 'react'
import Login from '../components/Login'
import SignUp from '../components/SignUp';
import { useHistory } from "react-router";

function HomePage() {
const history=useHistory();

  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("userInfo"))
    if(user){
      history.push('/chats')
    }
  }, [history])
  
  const [formType, setFormType] = useState('login');
  const handleButtonClick = (type) => {
    setFormType(type);
  };
  return (
    <>
    <div className='homeContainer w-screen h-screen flex flex-col items-center justify-center bg-[url("/path-to-bg.jpg")] bg-cover'>
      <div className=' justify-center text-4xl md:text-5xl font-bold text-blue-500 mb-6 bg-white/70 px-6 py-3 rounded-xl shadow-lg'>
        Connect Sphere
      </div>

        <div className='w-[85%] max-w-xl bg-slate-50 rounded-xl shadow-xl backdrop-blur-md p-6'>

        <div className='flex justify-between mb-6'>
          <button
            onClick={() => handleButtonClick('login')}
            className={`w-1/2 py-2 rounded-l-full text-xl font-semibold transition-all ${formType === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-100'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => handleButtonClick('signup')}
            className={`w-1/2 py-2 rounded-r-full text-xl font-semibold transition-all ${formType === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-100'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Conditional Rendering */}
        {formType === 'login' && <Login />}
        {formType === 'signup' && <SignUp />}
      </div>
    </div>
    </>
  );
  
}

export default HomePage
