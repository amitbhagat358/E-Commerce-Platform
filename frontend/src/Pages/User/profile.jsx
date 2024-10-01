import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// import Loader from "../../components/Loader";
import { useProfileMutation } from "../../Redux/api/usersApiSlice";
import { setCredentials } from "../../Redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div >
      <div>
        <div>
          <h2>Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div >
              <label >Email Address</label>
              <input
                type="email"
                placeholder="Enter email"

                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div >
              <label >Password</label>
              <input
                type="password"
                placeholder="Enter password"

                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div >
              <label >Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"

                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div >
              <button
                type="submit"

              >
                Update
              </button>

              <Link
                to="/user-orders"

              >
                My Orders
              </Link>
            </div>
            {/* {loadingUpdateProfile && <Loader />} */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;