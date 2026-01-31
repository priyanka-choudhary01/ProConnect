import { getAllUsers } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from './style.module.css';
import { BASE_URL } from "@/config";

function DiscoverPage() {
const authState = useSelector((state) => state.auth)
const router = useRouter();
const dispatch = useDispatch();

useEffect(()=>{
 if(!authState.all_profiles_fetched){
  dispatch(getAllUsers());
 }
},[])
    return ( 
    <UserLayout>
     
  <DashboardLayout>
   <div>
    <h1 >Discover</h1>
    <div className={style.allUserProfile}>
     {
      authState.all_profiles_fetched && authState.all_users.map((user) =>{
        return (
          <div onClick={()=>{
            router.push(`/view_profile/${user.userId.username}`)
          }}
          key={user._id} className={style.userCard}>
            <img className={style.userCard_image}src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile"/>
            <div>
            <h1> {user.userId.name}</h1>
            <p>{user.userId.username}</p>
          </div>
          </div>
        )
      })
     }
    </div>
   </div>
  </DashboardLayout>

   </UserLayout>  
     );
}

export default DiscoverPage;