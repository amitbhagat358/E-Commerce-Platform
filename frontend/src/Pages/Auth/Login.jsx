import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../Redux/features/auth/authSlice';
import { toast } from 'react-toastify';

import { useLoginMutation } from '../../Redux/api/usersApiSlice';

const Login = () => {
  console.log('Login component rendered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success('successfully logged in !!!');
    } catch (error) {
      toast.error(error.data);
    }
  };

  return (
    <div className="login w-screen h-screen flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center gap-16 w-[50%] p-12 rounded-xl ">
        <h1 className="w-full font-medium text-5xl text-start"> Sign In </h1>

        <form onSubmit={submitHandler} className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="email"> Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password"> Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Passwrod"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600 outline-none p-1  rounded-md"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center items-center w-32  h-10 mt-5 bg-pink-600 hover:border-2 hover:border-white rounded-md"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="w-full">
          <p>
            New Customer?
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="ml-5 underline"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
