import { useContext, useEffect, useState } from "react";
import styles from "./projects.module.css";
import appContext from "../../context/appContext";
import {
  getProjectsByUserId,
  previewFile,
  retreiveFile,
} from "../../services/services";
import Modal from "../modal/modal";
import Editor from "../editor/editor";
import { useNavigate } from "react-router-dom";
import ProjectRenderer from "../projectRenderer/projectRenderer";
import { Chip } from "@mui/material";

export default ({ id }) => {
  const context = useContext(appContext);
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [id]);

  const fetchProjects = async () => {
    const res = await getProjectsByUserId(id);
    if (!res?.error) {
      processProjects(res.documents);
    }
  };

  const processProjects = async (projects) => {
    let processed = await Promise.all(
      projects.map(async (p) => await processProject(p))
    );
    console.log(processed);
    setProjects([...processed]);
  };

  const processProject = async (project) => {
    let c = await getSrc(project?.cover);
    let files = await Promise.all(
      project?.files?.map(async (f) => {
        let file = await retreiveFile(f);
        let src = await getSrc(f);
        return {
          ...file,
          src: src,
        };
      })
    );
    return { ...project, files, cover: c };
  };

  const isUser = () => {
    let user = context?.data?.info?.["$id"];
    return context?.data?.login && id == user;
  };

  const showProject = (e, project) => {
    setSelected(project);
    setShowModal(true);
  };

  const addProject = () => {
    navigate("/editor");
  };

  const getSrc = async (id) => {
    const res = await previewFile(id);
    return res?.href;
  };

  return (
    <div className={styles.projectPage}>
      {isUser() && (
        <div className={styles.project} onClick={addProject}>
          <div className={styles.createLabel}>Create project</div>
        </div>
      )}
      {projects.map((p, i) => (
        <div
          key={i}
          className={styles.project}
          onClick={(e) => showProject(e, p)}
        >
          <img src={p?.cover} className={styles.cover} />
          <div className={styles.shadow}></div>
        </div>
      ))}
      {showModal && (
        <Modal
          isOpen={showModal}
          default={true}
          showBg={false}
          showClose={true}
          onClose={() => setShowModal(false)}
        >
          <ProjectRenderer project={selected}></ProjectRenderer>
        </Modal>
      )}
    </div>
  );
};
