import { useState,createContext } from "react";


const userOnline = createContext();

export default function OnlineUserProvider({children}){
    const [onlineUser,setOnlineUser] = useState([])

    return (
    <userOnline.Provider value={{ onlineUser ,setOnlineUser}}>
        {children}
    </userOnline.Provider>
)};

// eslint-disable-next-line react-refresh/only-export-components
export { userOnline };