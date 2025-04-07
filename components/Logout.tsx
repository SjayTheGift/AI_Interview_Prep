"use client"

import { signOut } from "@/lib/actions/auth.action";
import { toast } from "sonner";

const Logout = () => {
 
        
 const logoutUser = async () => {
    await signOut()
    toast.success("Logout successfully")
 }
   

  return (
    <>
        <p className="text-[20px] cursor-pointer hover:text-gray-300" onClick={logoutUser}>logout</p>
    </>
  )
}

export default Logout