import React from 'react'
import Avatar from 'react-avatar';


const Client =({userName})=>{
    return(<>



    <div
        style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "12px"
    }}
>
    <Avatar
        name={userName.toString()}
        size={50}
        round="14px"
        style={{ marginRight: "12px" }}
    />
    <span style={{ marginLeft: "8px", marginRight: "8px" }}>
        {userName.toString()}
    </span>
    </div>




    </>)
}
export default Client;