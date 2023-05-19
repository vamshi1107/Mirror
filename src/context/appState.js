import { useEffect, useState } from "react";
import appContext from "./appContext";

const AppState = (props) => {
  const [data, setData] = useState({ login: false, info: {} });

  useEffect(() => {
    syncStorage();
  }, []);

  const syncStorage = () => {
    if (sessionStorage.hasOwnProperty("data")) {
      const storage = JSON.parse(sessionStorage.getItem("data"));
      setData({ ...storage });
    }
  };

  const updateStorage = (data) => {
    sessionStorage.setItem("data", JSON.stringify(data));
  };

  function updateData(u) {
    setData({ ...u });
    updateStorage({ ...u });
  }

  return (
    <appContext.Provider value={{ data, updateData }}>
      {props.children}
    </appContext.Provider>
  );
};

export default AppState;
