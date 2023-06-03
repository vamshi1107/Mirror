import { useParams } from "react-router-dom";
import Header from "../header/header";
import "./account.css";
import Projects from "../projects/projects";

export default () => {
  const { id } = useParams();

  return (
    <>
      <Header></Header>
      <div className="account-page">
        <div className="banner"></div>
        <div className="sub-page">
          <div className="account-card">h</div>
          <div className="projects-con">
            <Projects id={id}></Projects>
          </div>
        </div>
      </div>
    </>
  );
};
