import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, RouterProvider, createRoutesFromElements } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './Redux/store.js';
import App from './App.jsx';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Profile from './Pages/User/profile.jsx';
import Home from './Pages/Home.jsx';
import Favourites from './Pages/Products/Favourites.jsx';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favourites" element={<Favourites />} />

      {/* {Registerd Users} */}

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
