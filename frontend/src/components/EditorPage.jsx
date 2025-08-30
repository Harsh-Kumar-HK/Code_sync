import React, { useEffect, useState , useRef} from "react";
import Client from "./Client";
import Editor from "./Editor";
import "./EditorPage.css";
import { initSocket } from "../Socket";
import { useLocation , useParams , useNavigate , Navigate} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {

    const [clients, setClients] = useState([]);
    const codeRef = useRef(null)

    const navigate = useNavigate()
    const socketRef = useRef(null);
    const location = useLocation();


    const {roomId} = useParams();

    const handleClick = ()=>{
        navigate('/');
    }


    useEffect(()=>{
        const init = async ()=>{

            const handleError = (e) =>{
                console.log('socket-error => ' , e);
                toast.error("socket connection failed");
                navigate('/');
            }


            socketRef.current = await initSocket()
            socketRef.current.on("connect_error", handleError);
            socketRef.current.on('connect_failed' , handleError)
            

            socketRef.current.emit('join', {
                roomId ,
                userName : location.state?.userName, 
            })

            socketRef.current.on('joined' , ({clients , userName , socketId})=>{
                
                if(userName !== location.state.userName){
                    toast.success( `${userName} joined`)
                }
                setClients(clients);
                socketRef.current.emit('sync-code' , {
                    code : codeRef.current,
                    socketId
                });
                
            });

            //disconnected

            socketRef.current.on('disconnected' , ({socketId , userName})=>{
                toast.success(`${userName} leaved the room`)
                setClients((prev)=>{
                    return prev.filter(
                        (client)=> client.socketId != socketId                    
                    )
                })
            })


        }
        init();

        return ()=>{
            socketRef.current.disconnect()
            socketRef.current.off('joined')
            socketRef.current.off('disconnected')
        }

    } , [])

    const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch (err) {
      toast.error("Failed to copy Room ID");
      console.error(err);
    }
  };

  // ✅ Leave Room
  const leaveRoom = () => {
    navigate("/");
  };


  

  if(!location.state.userName){
     return <Navigate to='/' />
  }

  return (
    <div className="editor-page">
      {/* Sidebar */}
      <div className="sidebar">
        <img
          src="/images/Itachi-sasuke.jpg"
          alt="Code_sync Loading..."
          className="sidebar-logo"
        />
        <hr className="divider" />

        <div className="clients-list">
          {clients.map((client) => (
            <Client key={client.socketId} userName={client.userName} />
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="btn btn-green"  onClick={copyRoomId}>Copy Room Id</button>
          <button className="btn btn-red"  onClick={leaveRoom}>Leave Room</button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="main-editor">
        <Editor socketRef={socketRef}  roomId={roomId} onCodeChange = {(code)=> codeRef.current = code}  />
      </div>
    </div>
  );
};

export default EditorPage;
