import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
// import Editor from "@monaco-editor/react";
import EditorPage from "./components/EditorPage";
import {Routes , Route} from 'react-router-dom'
import Home from "./components/Home";

import {Toaster} from 'react-hot-toast'



const App= () =>{
  return (
    <>


 <Toaster position="top-center"></Toaster>
    <Routes>

      <Route path='/' element={<Home/>}></Route>
      <Route path='/editor/:roomId' element={<EditorPage/>}></Route>


    </Routes>
    
    
    
    </>
  )
}

export default App
