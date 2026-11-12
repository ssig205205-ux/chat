import ChatBox from "./chatBox";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { funcitons } from "../contexts/functionContext";
import { useContext } from "react";

export default function GroupContainer() {
  const [group, setGroup] = useState([]);
  const { reFetch, getLocalStorage } = useContext(funcitons);
  const [refetch2, setReFetch2] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/findGroups",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const userData = await response.json();
        setGroup(userData);
      } catch (err) {
        console.error(err);
      }
    };

    // Initial fetch
    fetchRoom();

    // Listen for updates
    const handleGroupUpdate = (data) => {
      console.log("group-update:", data);
      fetchRoom(); // Refresh the group list
    };

    socket.on("group-update", handleGroupUpdate);

    // Cleanup
    return () => {
      socket.off("group-update", handleGroupUpdate);
    };
  }, [reFetch]);

   const pinnedGroup = getLocalStorage("pinnedGroup");
   const array = [...group];
   const pinnedGroupData = [];
  for (let i = 0; i < pinnedGroup.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (pinnedGroup[i] === array[j]._id) {
        pinnedGroupData.push(array[j]);
        array.splice(j, 1);
        break;
      }
    }
  }
  const array2 = [...array];
  if(pinnedGroupData.length > 0){
    array2.unshift(...pinnedGroupData,);
  }

  return (
    <>
      <h1 className="Title2">Groups</h1>

      <div className="roomContainer">
        {array2.map((room) => (
          <ChatBox
            key={room._id}
            roomName={room.roomName}
            text={room.latestMessage?.massage || "No messages yet"}
            roomId={room._id}
            otherUserId={room.otherUserId}
            setReFetch2={setReFetch2}
            refetch2={refetch2}
            pinned={pinnedGroupData.find((pinnedGroup) => pinnedGroup._id === room._id) ? "pinned" : "unpinned"}
          />
        ))}
      </div>
    </>
  );
}