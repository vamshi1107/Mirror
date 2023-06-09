import { createPortal } from "react-dom";
import styles from "./modal.module.css";
import { useEffect } from "react";

export default (props) => {
  useEffect(() => {
    loadLayout();
    return () => {
      revertLayout();
    };
  }, []);

  const loadLayout = () => {
    const root = document.getElementById("root");
    root.classList.add("block");
  };

  const revertLayout = () => {
    const root = document.getElementById("root");
    root.classList.remove("block");
  };

  return createPortal(
    <div className={styles.modal}>
      <div className={styles.contentCon}>
        <div
          className={
            (props?.default ? styles.content : "") +
            " " +
            (props?.showBg ? styles.bgWhite : "")
          }
        >
          {props?.children}
        </div>
      </div>
      <div className={styles.head}>
        {props?.showClose && (
          <div onClick={props?.onClose} className={styles.closeCon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8.09 8.08"
              className={styles.close}
            >
              <path d="M5.18 4.05L7.84 6.7a.75.75 0 0 1 .2.27.88.88 0 0 1 0 .31.83.83 0 0 1-.06.3.63.63 0 0 1-.18.27.42.42 0 0 1-.12.11l-.15.08h-.15a.72.72 0 0 1-.3 0h-.15l-.15-.08a.41.41 0 0 1-.12-.11L4.04 5.18 1.37 7.84a.42.42 0 0 1-.12.11l-.15.08H.95a.72.72 0 0 1-.3 0H.5l-.15-.08a.41.41 0 0 1-.12-.11.63.63 0 0 1-.19-.26.83.83 0 0 1 0-.3.88.88 0 0 1 0-.31.75.75 0 0 1 .18-.27L2.9 4.05.24 1.38a.63.63 0 0 1-.2-.27.83.83 0 0 1 0-.3.88.88 0 0 1 0-.29.75.75 0 0 1 .18-.27.73.73 0 0 1 .27-.18.84.84 0 0 1 .61 0 .73.73 0 0 1 .27.18l2.67 2.66L6.71.24a.73.73 0 0 1 .27-.18.84.84 0 0 1 .61 0 .73.73 0 0 1 .27.18.75.75 0 0 1 .18.28.88.88 0 0 1 0 .29.83.83 0 0 1-.06.3.63.63 0 0 1-.18.27L5.18 4.05z"></path>
            </svg>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("ext")
  );
};
