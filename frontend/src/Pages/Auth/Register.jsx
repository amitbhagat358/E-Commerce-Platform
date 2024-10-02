import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../Redux/api/usersApiSlice';
import { setCredentials } from '../../Redux/features/auth/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success('User successfully registered');
      } catch (err) {
        toast.error(err.data);
      }
    }
  };

  return (
    <section className="flex flex-col justify-center items-center w-screen h-screen gap-8">
      <div className="flex flex-col w-1/2 gap-8">
        <h1 className="text-4xl">Register</h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center items-center w-32  h-10 mt-5 bg-pink-600 hover:border-2 hover:border-white rounded-md"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

        </form>

        <div>
          <p>
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
