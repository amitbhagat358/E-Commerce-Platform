import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// import Loader from "../../components/Loader";
import { useProfileMutation } from '../../Redux/api/usersApiSlice';
import { setCredentials } from '../../Redux/features/auth/authSlice';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen ">
      <div className="flex flex-col w-1/2 gap-10">
        <h2 className="text-5xl">Update Profile</h2>
        <form onSubmit={submitHandler} className="flex flex-col gap-7 w-full">
          <div className="flex flex-col gap-1">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-[80%] bg-[#323236] text-white border-2 border-gray-600  outline-none p-1  rounded-md"
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              disabled={loadingUpdateProfile}
              type="submit"
              className="flex justify-center items-center w-32  h-10 mt-5 bg-pink-600 hover:border-2 hover:border-white rounded-md"
            >
              {loadingUpdateProfile ? 'Updating...' : 'Update'}
            </button>

            <Link to="/user-orders" className='underline text-right w-[80%]'>My Orders</Link>
          </div>
          {/* {loadingUpdateProfile && <Loader />} */}
        </form>
      </div>
    </div>
  );
};

export default Profile;
