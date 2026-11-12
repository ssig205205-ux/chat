import ChatBox from "./chatBox";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { userOnline } from "../contexts/onlineContext";
import { socket } from "../socket";
import { funcitons } from "../contexts/functionContext";

export default function RoomContainer() {
  const { user } = useContext(AuthContext);
  const { onlineUser } = useContext(userOnline);
  const [room, setRoom] = useState([]);
  const userId = user?.user?._id; // Use optional chaining to safely access the user ID
  const userName = user?.user?.name;
  const {reFetch} = useContext(funcitons);
  const { getLocalStorage } = useContext(funcitons);
  const [refetch2, setReFetch2] = useState(0);

  // Use optional chaining to safely access the user name
  useEffect(() => {
    console.log("User ID:", user?.user?._id); // Log the user ID
    const fetchRoom = async () => {
      const response = await fetch(`http://localhost:5000/api/findRooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });
      const userData = await response.json();
      setRoom(userData);
    };

    fetchRoom();
    const handleRoomUpdate = (room) => {
      fetchRoom();
      console.log("room update:", room);
    };

    socket.on("room-update", handleRoomUpdate);

    const handleDiconnect = (data) => {
      console.log("diconnect:", data);
    };

    socket.on("Disconnected", handleDiconnect);

    return () => {
      socket.off("Disconnected", handleDiconnect);
      socket.off("room-update", handleRoomUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user,reFetch,refetch2]);

  const pinnedRoom = getLocalStorage("pinnedRoom");
  console.log("pinnedRoom:", pinnedRoom);
  const array = [...room];
  const pinnedRoomData = [];
  for (let i = 0; i < pinnedRoom.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (pinnedRoom[i] === array[j]._id) {
        pinnedRoomData.push(array[j]);
        array.splice(j, 1);
        break;
      }
    }
  }
  let array2 = [...array];
  if (pinnedRoomData.length > 0) {
    array2.unshift(...pinnedRoomData);
  }
  console.log("pinnedRoomData:", array2);


  const namespilter = array2.map((e, index) => {
    const names = e.roomName.split("&");
    const otherUserName = names.find((name) => name !== userName);
    let otherUserID;
    if (e.userOneID === userId) {
      otherUserID = e.userTwoID.toString();
    } else {
      otherUserID = e.userOneID.toString();
    }
    let pinned;
    if(e._id === pinnedRoomData[index]?._id){
      pinned = "pinned";
    } else {
      pinned = "unpinned";
    }

    return { ...e, otherUserName, otherUserID, isOnline: "offline", pinned };
  });

  console.log("namespilter:", namespilter);
  console.log("onlineUser", onlineUser);

  for (let i = 0; i < namespilter.length; i++) {
    namespilter[i].isOnline = "offline";

    for (let j = 0; j < onlineUser.length; j++) {
      if (namespilter[i].otherUserID === onlineUser[j].userID) {
        namespilter[i].isOnline = "online";
        break;
      }
    }
  }

  console.log("namespillter", namespilter);
  console.log("onlineUserAll", onlineUser);
  console.log("context user", onlineUser);

  return (
    <>
      <h1 className="Title2">Rooms</h1>
      <div className="roomContainer">
        {namespilter.map((e) => (
          <ChatBox
            roomName={e.otherUserName}
            text={e.latestMessage?.massage}
            roomId={e._id}
            key={e._id}
            status={e.isOnline}
            otherUserId={e.otherUserID}
            setReFetch2={setReFetch2}
            pinned={e.pinned}
          />
        ))}
      </div>
    </>
  );
}
