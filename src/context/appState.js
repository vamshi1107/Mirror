import { useEffect, useState } from "react";
import appContext from "./appContext";

const AppState = (props) => {
  const [data, setData] = useState({ login: false, info: {}, prev: "" });

  useEffect(() => {
    syncStorage();
  }, []);

  const syncStorage = () => {
    if (sessionStorage.hasOwnProperty("data")) {
      const storage = JSON.parse(sessionStorage.getItem("data"));
      setData({ ...storage });
      return storage;
    }
    return data;
  };

  const updateStorage = (data) => {
    sessionStorage.setItem("data", JSON.stringify(data));
  };

  const setPrev = (prev) => {
    let up = syncStorage();
    setData({ ...up, prev: prev });
    updateStorage({ ...up, prev: prev });
  };

  const clearPrev = (prev) => {
    let up = syncStorage();
    setData({ ...up, prev: "" });
    updateStorage({ ...up, prev: "" });
  };

  function updateData(u) {
    setData({ ...u });
    updateStorage({ ...u });
  }

  return (
    <appContext.Provider value={{ data, updateData, setPrev, clearPrev }}>
      {props.children}
    </appContext.Provider>
  );
};

export default AppState;
