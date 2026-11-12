import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Gheader() {
  const nevigate = useNavigate();

  const handleBack =()=>{
    nevigate(-1);
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
        <h1 className="Title">Create Group</h1>
      </div>
    </div>
  );
}
