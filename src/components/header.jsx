
import { Link } from "react-router-dom";

export default function Header({ page }) {
  let link;
  let style2;
  if (page === "groupPage") {
    link = "/GroupMaker";
    style2 = "FindUser2";
  } else if (page === "profile") {
    link = "/Profile";
  } else {
    link = "/FFinder";
    style2 = "FindUser";
  }

  return (
    <div className="headerContainer">
      <Link to={"/"} style={{textDecoration:"none",color: "black"}}>
      <div className="ImgAndTitleContainer">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
          alt="Logo"
          className="Img1"
        />
        <h1 className="Title">Chatter</h1>
      </div></Link>

      <div className="FindUserContainer">
        <Link to={link} style={{ textDecoration: "none" }}>
          { link !== "/Profile" ?
          <button className={style2}>
            {link === "/GroupMaker" ? "Create Group" : "+"}
          </button> : <></> }
        </Link>
      </div>
    </div>
  );
}
