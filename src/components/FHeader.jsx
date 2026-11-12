import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScanLine } from 'lucide-react';

export default function FHeader() {
  const nevigate = useNavigate();

  const handleBack =()=>{
    nevigate("/");
  }

  return (
    <div className="headerContainer ffH">
     
      <div className="ImgAndTitleContainer">
        <ArrowLeft className="fArrow" onClick={handleBack} />
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
          alt="Logo"
          className="Img1"
        />
        <h1 className="Title">Chatter</h1>
      </div>
      <div className="qrScanner" onClick={()=> {nevigate("/Scanner")}}>
        <ScanLine/>
      </div>
    </div>
  );
}
