import { useContext, useEffect, useState } from "react";
import styles from "./projects.module.css";
import appContext from "../../context/appContext";
import { getProjectsByUserId } from "../../services/services";
import Modal from "../modal/modal";
import Editor from "../editor/editor";
import { useNavigate } from "react-router-dom";

export default ({ id }) => {
  const context = useContext(appContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [id]);

  const fetchProjects = async () => {
    const res = await getProjectsByUserId(id);
    if (!res?.error) {
      setProjects(res.documents);
    }
  };

  const isUser = () => {
    let user = context?.data?.info?.["$id"];
    return context?.data?.login && id == user;
  };

  const showProject = () => {
    setShowModal(true);
  };

  const addProject = () => {
    navigate("/editor");
  };

  return (
    <div className={styles.projectPage}>
      {isUser() && (
        <div className={styles.project} onClick={addProject}>
          Add Project
        </div>
      )}
      <div className={styles.project} onClick={showProject}></div>
      <div className={styles.project} onClick={showProject}></div>
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div></div>
        </Modal>
      )}
    </div>
  );
};
