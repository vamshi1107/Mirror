import { useParams } from "react-router-dom";
import Header from "../header/header";
import styles from "./account.module.css";
import Projects from "../projects/projects";
import { useEffect, useState } from "react";
import About from "../about/about";
import { getUser } from "../../services/services";

export default () => {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState([]);

  useEffect(() => {
    getDetails();
  }, [id]);

  const getDetails = async () => {
    const details = await getUser(id);
    if (Object.keys(details).length > 0) {
      setUser(details);
    }
  };

  return (
    <>
      <Header></Header>
      <div className={styles.accountPage}>
        <div className={styles.banner}></div>
        <div className={styles.subPage}>
          <div className={styles.accountCard}>
            <div className={styles.avatar}>
              <div className={styles.avatarImg}></div>
            </div>
            <div className={styles.username}>{user?.name}</div>
            <div className={styles.bio}>{user?.bio}</div>
          </div>
          <div className={styles.sidePane}>
            <div className={styles.sideHeader}>
              <span
                className={
                  tab == 0 ? styles.tab + " " + styles.selected : [styles.tab]
                }
                onClick={() => setTab(0)}
              >
                Projects
              </span>
              <span
                className={
                  tab == 1 ? styles.tab + " " + styles.selected : [styles.tab]
                }
                onClick={() => setTab(1)}
              >
                About
              </span>
            </div>
            {tab == 0 && (
              <div className={styles.projectsCon}>
                <Projects id={id}></Projects>
              </div>
            )}
            {tab == 1 && (
              <div className={styles.projectsCon}>
                <About id={id} user={user}></About>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
