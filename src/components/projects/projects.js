import { useContext, useEffect, useState } from "react";
import styles from "./projects.module.css";
import appContext from "../../context/appContext";
import { getProjectsByUserId } from "../../services/services";

export default ({ id }) => {
  const context = useContext(appContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, [id]);

  const fetchProjects = async () => {
    const res = await getProjectsByUserId(id);
    if (!res?.error) {
      setProjects(res.documents);
    }
  };

  return (
    <div className={styles.projectPage}>
      <div className={styles.project}></div>
      <div className={styles.project}></div>
      <div className={styles.project}></div>
    </div>
  );
};
