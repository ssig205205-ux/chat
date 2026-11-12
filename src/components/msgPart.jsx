import  { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export default function MsgPart({sender,message}) {

  // Log the sender prop
  const { user } = useContext(AuthContext);
  
  const userId = user?.user?._id; // Use optional chaining to safely access the user ID
 
    
  return (
    <>
    {sender !== userId ? (
    
  <div className="msgBoxContainer">
    <div className="msg sender">
     <img
      src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
      alt="Logo"
      className="IconImg"
    />
    <div className="msgBox rec">
      <p>{message}</p>
    </div>
    
  </div></div>
) : (
   
  <div className="msgBoxContainer ">
    <div className="msg receiver">
    <div className="msgBox sen">
      <p>{message}</p>
    </div>
 
  <img
      src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
      alt="Logo"
      className="IconImg"
    /> 
 </div></div>
)}
</>  );
}
