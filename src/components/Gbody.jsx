import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


export default function Gbody() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [memberlist, setMemberlist] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user?.user?._id;


  const handleChange = (e) => {
    setGroupName(e.target.value);
    console.log(e.target.value);
  };

  const handleClick = (e) => {
    if (e.target.checked) {
      setMemberlist((pre) => [...pre, e.target.value]);
    } else {
      setMemberlist((pre) => pre.filter((member) => member !== e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(groupName, memberlist);
    try {
      const response = await fetch("http://localhost:5000/api/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: groupName, members:[userId,...memberlist]  }),
        credentials: "include",
      });
      const data = await response.json();
      
      navigate(`/chatPages/${data?.roomName}/${data._id}/${undefined}`,{
         state: {
        from: "/Group",
      },
      })
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(memberlist);
  }, [memberlist]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/findFriends", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("something is wrong");
        }
        const data = await response.json();
        console.log(data);
        setFriendList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoom();
  }, []);
  console.log("friendList", friendList);
  const friendMap = [...friendList];
  return (
    <div className="Gbody">
      <form className="groupForm" onSubmit={handleSubmit}>
        {/* Group Name */}
        <div>
          <div className="formGroup">
            <label className="glabel" htmlFor="groupName">
              Group Name
            </label>

            <input
              id="groupName"
              name="groupName"
              placeholder="Enter group name"
              type="text"
              onChange={handleChange}
              required
            />
          </div>

          {/* Search Members */}
        </div>

        {/* Members */}
        <div className="memberList">
          <h1 className="Gh1">Friends List</h1>
          <p className="Gp1">Check the box to add </p>
          <hr></hr>
          <div className="friendList">
            {friendMap.map((e) => (
              <label className="member">
                <input
                  type="checkbox"
                  name="members"
                  value={e._id}
                  onChange={handleClick}
                />

                <div className="memberAvatar">J</div>

                <div className="memberInfo">
                  <span>{e.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Members */}
        <p className="selectedCount">{memberlist.length} members selected</p>

        {/* Submit */}
        <button className="createGroupBtn" type="submit">
          Create Group
        </button>
      </form>
    </div>
  );
}
