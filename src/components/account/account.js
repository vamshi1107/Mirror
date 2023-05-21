import { useParams } from "react-router-dom";
import Header from "../header/header";
import "./account.css";

export default () => {
  const { id } = useParams();

  return (
    <>
      <Header></Header>
      <div className="account-page">
        <div className="banner"></div>
        <div className="sub-page">
          <div className="account-card">h</div>
          <div className="projects-con">h</div>
        </div>
      </div>
    </>
  );
};
