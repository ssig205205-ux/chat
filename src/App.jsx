import { MainPage } from "./mainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPages from "./ChatPages";
import Friend_Finder from "./friendFinder";
import { Singup, Login } from "./Singup&Login";
import { useContext } from "react";
import  GroupPage from "./groupPage"
import GroupMaker from "./groupMaker"
import Profile from "./profile";
import { AuthContext } from "./contexts/authContext";
import { userOnline } from "./contexts/onlineContext";
import { useEffect } from "react";
import { socket } from "./socket";
import QrScanner from "./qrScanner";
import {routeContext} from "./contexts/routeContext";
import RouteTracker from "./components/RouteTracker";
import QrPage from "./qrPage"


import BottomNav from "./components/navBar"

export default function App() {
  const { setUser } = useContext(AuthContext);
  const { setOnlineUser } = useContext(userOnline);
  const { currentRoute } = useContext( routeContext);

  useEffect(() => {
    const fetchuser = async () => {
      const response = await fetch("http://localhost:5000/api/me", {
        credentials: "include",
      });
      const userData = await response.json();
      setUser(userData);
    };
    fetchuser();

    socket.connect();

    const handleOnlineStatus = (data) => {
      console.log("status", data);

      setOnlineUser((prev) => {
        if (prev.some((u) => u.userID === data.userID)) {
          return prev;
        }

        return [...prev, data];
      });
    };
    const handleOnlineFriend = (data) => {
      console.log("friend Online", data);

      setOnlineUser(data);
    };
    const handleDisconnect =(data)=>{
      console.log("disconnect:", data)
      const removeUser =(id)=>{
        setOnlineUser((prev)=> prev.filter((user)=> user.userID !== id))
      }
      removeUser(data)
  

    }

    socket.on("onlineStatus", handleOnlineStatus);
    socket.emit("isUserOnline");
    socket.on("sendOnlinedUsers", handleOnlineFriend);
    socket.on("statusOffline",handleDisconnect)       
    

    return () => {
      socket.off("onlineStatus", handleOnlineStatus);
      socket.off("sendOnlinedUsers", handleOnlineFriend);
      socket.disconnect();
    };
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 

  return (
    <>
      <BrowserRouter>
      <RouteTracker/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chatPages/:user2Name/:roomId/:otherUserId" element={<ChatPages />} />
          <Route path="/SignUp" element={<Singup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/FFinder" element={<Friend_Finder/>}/>
          <Route path="/Group" element={<GroupPage/>}/>
          <Route path="/GroupMaker" element={<GroupMaker/>}/>
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/QrPage" element={<QrPage/>}/>
          <Route path="/Scanner" element={<QrScanner/>}/>
        </Routes>
        {currentRoute && <BottomNav />}
      </BrowserRouter>
    </>
  );
}
