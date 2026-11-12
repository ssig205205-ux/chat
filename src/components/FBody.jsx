
import searchIcon from "../assets/searchIcon.png";
import { SearchIcon, X } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { QrResult } from "../contexts/qrContext";

export default function Fbody() {
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [userData, setData] = useState([]);

  const { user } = useContext(AuthContext);
  const { result } = useContext(QrResult);

  const userId = user?.user?._id;
  const userName = user?.user?.name;

  const navigate = useNavigate();

  const CreateRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/createRoom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userOneID: userId,
            userTwoID: userData._id,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      console.log(data);

      const names = data.roomName.split("&");

      const otherUserName = names.find(
        (name) => name !== userName
      );

      navigate(
        `/chatPages/${otherUserName}/${data._id}/${userData._id}`,
        {
          state: {
            from: "/",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = async (e, searchEmail = email) => {
    // Prevent form reload only when called from the form
    if (e) {
      e.preventDefault();
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/findUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: searchEmail,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      console.log("Found user:", data);

      setData(data);
      setShowResult(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Search automatically when QR scanner gives us a result
  useEffect(() => {
    if (!result) return;

    console.log("QR Result:", result);
  
    setEmail(result);

    handleClick(null, result.toString());
  }, [result]);

  const handleReset = () => {
    setShowResult(false);
    setEmail("");
    setData([]);
  };

  return (
    <div className="fbody">
      <div className="fTitle">
        <img
          src={searchIcon}
          alt="searchIcon"
          width={40}
        />

        <div>
          <h1 className="fT1">Find Your Friends</h1>
          <p className="fT2">
            search and connect with people you love
          </p>
        </div>
      </div>

      <hr />

      <form
        className="fSearch"
        onSubmit={handleClick}
      >
        <input
          placeholder="enter email"
          type="email"
          value={email}
          className="fInput"
          onChange={handleChange}
          required
        />

        <button
          className="fbt"
          type="submit"
        >
          <SearchIcon />
        </button>
      </form>

      <div className="fResultContainer">
        {showResult && (
          <div className="fResult">

            <div className="resultTitle">
              <h1 className="fresult">
                Result
              </h1>

              <X
                className="X"
                onClick={handleReset}
              />
            </div>

            <hr className="hr2" />

            <div className="fResultDiv">

              <div className="chatBoxContent">

                <div className="imgOnline">

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="Logo"
                    className="IconImg"
                  />

                  <div className="onlineStatus"></div>

                </div>

                <div className="chatBoxText">
                  <h1>{userData.name}</h1>
                  <p>{userData.email}</p>
                </div>

              </div>

              <button
                className="fResultBt"
                onClick={CreateRoom}
              >
                Add Contacts
              </button>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

