import { createContext, useState } from "react";

const funcitons = createContext();

export default function FContext({ children }) {
  const [reFetch, setRefetch] = useState("");

  //delete chat
  const alerts = async (e) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/deleteRoom/${e}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const userData = await response.json();
      console.log(userData);
      setRefetch(userData);
    } catch (err) {
      console.error(err);
    }
  };

  //remove group member
  const leaveMember = async (groupId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/removeMember/${groupId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const userData = await response.json();
      console.log(userData);
      setRefetch(userData);
    } catch (err) {
      console.error(err);
    }
  };

  //save the pined room and group in local storage
  const saveLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };


  const getLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  };


  const save2LocalStorage = (key, value) => {
    const array = getLocalStorage(key);
    //check if the value already exists in the array, if not push it to the array
    if (!array.includes(value)) {
      array.push(value);
    }
    saveLocalStorage(key, array);
  };

  const removeLocalStorage = (key, value) => {
    const array = getLocalStorage(key);

    const newArray = array.filter((item) => item !== value);

    saveLocalStorage(key, newArray);
  };

  return (
    <funcitons.Provider
      value={{
        alerts,
        reFetch,
        leaveMember,
        save2LocalStorage,
        getLocalStorage,
        removeLocalStorage,
      }}
    >
      {children}
    </funcitons.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { funcitons };
