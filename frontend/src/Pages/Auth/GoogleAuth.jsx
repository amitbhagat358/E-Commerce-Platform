import { setCredentials } from "@/Redux/features/auth/authSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userInfo = searchParams.get("user");
    if (userInfo) {
      dispatch(setCredentials(JSON.parse(userInfo)));
      navigate("/");
    }
  }, [searchParams, dispatch, navigate]);

  return <div>Google Authentication page</div>;
};

export default GoogleAuth;
