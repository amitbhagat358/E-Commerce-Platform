import React from 'react';
import { Outlet } from 'react-router-dom';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="sticky top-0" />
        <Outlet></Outlet>
      </SidebarProvider>
    </>
  );
}

export default App;
