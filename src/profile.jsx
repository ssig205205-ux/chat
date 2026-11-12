import Header from "./components/header";
import { QrCode } from "lucide-react";
import { SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContext";
import { LogOut } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
   const { user } = useContext(AuthContext);
    const name = user?.user?.name;
    const email = user?.user?.email; 

    const handleLogout = async () => {
      if(confirm("Are you sure you want to logout?")) {
      try {
        const response = await fetch("http://localhost:5000/api/Logout", {
          method: "POST",
          credentials: "include"
        });
        const data = await response.json();
        if (data.message === "Logged out successfully") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }}
    };

  return (
    <>
      <Header page={"profile"} />
      <section id="profile">
        <div className="pContainer">
          <div className="profilerPic">jk</div>
          <h1>{name}</h1>
          <div className="PtoolBar">
            <button onClick={()=>{navigate("/QrPage")}}>
              <QrCode />
            </button>
            <button>
              <SquarePen />
            </button>
            <button title="Logout" onClick={handleLogout}>
              <LogOut/>
            </button>
          </div>
          <div className="infoBar">
            <div className="infoDiv">
              <h1>{name}</h1>
              <small>Username</small>
              <hr></hr>
              <h1>{email}</h1>
              <small>Email</small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
