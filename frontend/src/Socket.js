import {io} from 'socket.io-client'


export const initSocket = () =>{
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const option = {
        'force new connection': true,
        reconnectionAttempts : 'infinity',
        timeout:10000,
        transports : ['websocket']
    };
    return io(backendURL , option)
}