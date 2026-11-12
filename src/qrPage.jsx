import QRCode from "react-qr-code";
import { ArrowLeft } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContext";
import { useNavigate } from "react-router-dom";


export default function QrPage(){
    const navigate = useNavigate(); 
    const { user } = useContext(AuthContext);
  
    const email = user?.user?.email; 
    console.log(email);
    return(
        <>
        <section id="qr">
            <div className="headerContainer ffH">
                 
                  <div className="ImgAndTitleContainer">
                    <ArrowLeft className="fArrow" onClick={()=>{navigate("/Profile")}}/>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                      alt="Logo"
                      className="Img1"
                    />
                    <h1 className="Title">Chatter</h1>
                  </div>
                </div>
            <div className="QrContainer">
                 <QRCode className="qrCode" value={email} size={220} />
                 <h1>{email}</h1>
            </div>
        </section>
        </>
    )
}