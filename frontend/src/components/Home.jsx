import React, { useState } from "react";
import toast from "react-hot-toast";
import "./Home.css"; 
import {v4 as uuid} from 'uuid'
import {  useNavigate } from "react-router-dom";



const Home = () => {

    const[roomId , setRoomId] = useState("")
    const[userName , setUserName] = useState("")
    const navigate = useNavigate();

    const generateRoomId=(e)=>{
      e.preventDefault();
      const id = uuid()
      setRoomId(id)
      toast.success("Room id Generated successfully")
    }
  
  const joinRoom =() =>{
    if(!roomId || !userName){
      toast.error("ID and Username is a mandatory field")
      return;
    }

    navigate(`/editor/${roomId}` , {
      state :{userName},
    })
    toast.success("Room is created successfully")
 }

  return (

    <div className="container">
  <div className="row">
    <div className="card-container">
      <div className="card">
        <div className="card-body">
          <img
            src="/images/Itachi-sasuke.jpg"
            alt="Code_sync Loading..."
            className="card-image"
          />
        </div>
        <h4 className="title">Enter the roomId</h4>
        <div className="form-group">
          <input type="text" className="input-field" placeholder="Room Id" value={roomId} onChange={(e)=>setRoomId(e.target.value)}/>
          <input type="text" className="input-field" placeholder="UserName" value={userName} onChange={(e)=>setUserName(e.target.value)} />
        </div>
        <button className="btn-join" onClick={joinRoom}>JOIN</button>
        <p className="new-room-text">
          Don’t have a room Id?{" "}
          <span className="new-room-link" onClick={generateRoomId}>New room</span>
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default Home;
