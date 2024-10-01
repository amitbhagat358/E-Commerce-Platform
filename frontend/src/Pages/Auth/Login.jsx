import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../Redux/features/auth/authSlice';
import { toast } from 'react-toastify';

import { useLoginMutation } from "../../Redux/api/usersApiSlice";

const Login = () => {

  console.log("Login component rendered");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [login, { isLoading }] = useLoginMutation();

  const {userInfo} = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || "/";
  


  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) =>{
    e.preventDefault();

    try{
      const res = await login({email, password}).unwrap()
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("successfully logged in !!!")
    } catch(error){
      toast.error(error.data);
    }
  }

  return (
    <div className='login'>
      <div>
        <h1> Sign In </h1>

        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="email"> Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">  Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button disabled={isLoading} type='submit'>
            {isLoading? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div >
            <p>
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Register
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
};

export default Login;
