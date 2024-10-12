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
  
  const [formType, setFormType] = useState(null);
  const handleButtonClick = (type) => {
    setFormType(type);
  };
  return (
    <div className='homeContainer w-screen h-screen'>
      <div className='talkTive translate-x-full translate-y-8 bg-slate-200 rounded-md text-black font-bold text-4xl flex justify-center items-center'>Talk-A-Tive</div>
      <div className='Detail bg-slate-200 translate-x-full translate-y-11 rounded-md '>
        <div className='flex justify-between pt-4'>
          <button onClick={() => handleButtonClick('login')} className=' w-96 h-10 rounded-full font-semibold text-2xl ml-5 hover:bg-blue-500'>Login</button>
          <button onClick={()=>handleButtonClick('signup')} className='w-96 h-10 rounded-full font-semibold text-2xl ml-5 hover:bg-blue-500'>Sign Up</button>
        </div>
      {formType === 'login' && <Login />}
      {formType==='signup'&&<SignUp/>}
      </div>
    </div>
  )
}

export default HomePage
