"use client"
import { store } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Navbar from '../component/admin/Navbar'
import Sidebar from '../component/admin/Sidebar'

const AdminStoreprovider = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-user", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();

  
        if(data?.user?.role !== "admin"){
          router.push("/")
        }
       
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []); 


  return (
    <>
    <Provider store={store}>
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}  isOpen={isSidebarOpen}/>
        <Sidebar  isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        {children}
      </Provider>
    </>
  )
}

export default AdminStoreprovider