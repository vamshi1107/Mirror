import { useParams } from "react-router-dom";
import Header from "../header/header";
import styles from "./account.module.css";
import Projects from "../projects/projects";
import { useEffect, useState } from "react";
import About from "../about/about";
import Modal from "../modal/modal";
import { getUser } from "../../services/services";

export default () => {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState([]);
  const [found, setFound] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDetails();
  }, [id]);

  const getDetails = async () => {
    setIsLoading(true);
    const details = await getUser(id);
    if (Object.keys(details).length > 0) {
      setUser(details);
      setIsLoading(false);
      setFound(true);
    } else {
      setFound(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header></Header>
      <div className={styles.accountPage}>
        {isLoading && (
          <Modal showClose={false} default={true}>
            <div className={styles.loading}>
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_fityEfMraU.json"
                background="transparent"
                speed="1"
                style={{ width: "200px", height: "200px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
          </Modal>
        )}
        {!isLoading && !found && (
          <Modal showBg={false} showClose={false} default={true}>
            <div className={styles.alert}>User not found</div>
          </Modal>
        )}
        {!isLoading && found && (
          <>
            <div className={styles.banner}></div>
            <div className={styles.subPage}>
              <div className={styles.accountCard}>
                <div className={styles.avatar}>
                  <div className={styles.avatarImg}></div>
                </div>
                <div className={styles.username}>{user?.name}</div>
                <div
                  className={styles.bio}
                  dangerouslySetInnerHTML={{ __html: user?.bio }}
                ></div>
              </div>
              <div className={styles.sidePane}>
                <div className={styles.sideHeader}>
                  <span
                    className={
                      tab == 0
                        ? styles.tab + " " + styles.selected
                        : [styles.tab]
                    }
                    onClick={() => setTab(0)}
                  >
                    Projects
                  </span>
                  <span
                    className={
                      tab == 1
                        ? styles.tab + " " + styles.selected
                        : [styles.tab]
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
          </>
        )}
      </div>
    </>
  );
};
