import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect } from 'react'
import style from './style.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';


function MyConnectionsPage() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

useEffect(() => {
  dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
},[])
useEffect(() => {
 if(authState.connectionRequest?.length != 0){
  console.log(authState.connectionRequest)
 }
},[authState.connectionRequest])
    return ( 
    <UserLayout>
    <DashboardLayout>

   <div className={style.myConnections}>
   {authState.connectionRequest?.length ===0 ? <h1>No Connection Request Pending</h1> : <h1>My Connections</h1>}
    {authState.connectionRequest?.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user,index) =>{
      return (
      <div onClick={()=>{
        router.push(`/view_profile/${user.userId.username}`) 
      }} className={style.userCard} key={index}>
        <div style={{display:"flex" , alignItems:"center",width:"100%" , gap:"1.2rem" }}>
          <div className={style.profilePicture}>
            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt=''/>
          </div>
        <div className={style.userInfo}>
          <h3>{user.userId.name}</h3>
          <p>{user.userId.username}</p>
        </div>
        <button onClick={async(e) =>{
          e.stopPropagation();

         await dispatch(AcceptConnection({
          connectionId: user._id,
          token:localStorage.getItem("token"),
          action:'accept'
         }),
        )
        }} className={style.acceptBtn}>Accept</button>
        </div>
        </div>
      )
    })}
   <h4>My Network</h4>
    {authState.connectionRequest?.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user,index) =>{
      return (
      <div onClick={()=>{
        router.push(`/view_profile/${user.userId.username}`) 
      }} className={style.userCard} key={index}>
        <div style={{display:"flex" , alignItems:"center",width:"100%" , gap:"1.2rem" }}>
          <div className={style.profilePicture}>
            <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt=''/>
          </div>
        <div className={style.userInfo}>
          <h3>{user.userId.name}</h3>
          <p>{user.userId.username}</p>
        </div>
        </div>
        </div>
      )
    })}

   </div>
  </DashboardLayout>

   </UserLayout>  
     );
}

export default MyConnectionsPage;