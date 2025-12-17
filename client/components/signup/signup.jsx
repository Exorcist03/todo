import React, { useState } from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(true);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:8000';
    const handleOnClick = async () => {
        try {
            const what = isSignup ? "signup":"login";
            const response = await axios.post(`${backendUrl}/api/users/${what}`, {
                email, username, password
            })
            const token = response.data.token;
            console.log(token);
            localStorage.setItem("authToken", token);
            navigate('/home');
        } catch (error) {
            alert(error);
            console.error("error while fetching the signup api,", error);
        }
    }


  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <div className='flex flex-col bg-amber-200 h-80 w-100 items-center justify-center' >
        {isSignup && <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='Username' className='mx-2 my-3 w-77 p-1' />}
        <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder='E-mail' className='mx-2 my-3 w-77 p-1' />
        <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='mx-2 my-3 w-77 p-1' />
        <button onClick={handleOnClick} className='bg-amber-100 mx-2 my-3 w-77 p-1 hover:cursor-pointer'> {isSignup ? "Signup" : "Login"}</button>
        {isSignup && <p>Already have an account ? <button onClick={() => setIsSignup(false)} className='hover:cursor-pointer'>LogIn</button> </p>}
        {!isSignup && <p>Don't have an account ? <button onClick={() => setIsSignup(true)} className='hover:cursor-pointer'>Signup</button> </p>}
      </div>
    </div>
  )
}

export default Signup
