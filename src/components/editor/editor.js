import { useRef, useState } from "react";
import Header from "../header/header";
import styles from "./editor.module.css";
import { Document, Page } from "react-pdf";
import PdfRenderer from "../pdfRenderer/pdfRenderer";
import icon from "./add-icon.png";

export default () => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  const addFile = () => {
    inputRef.current.click();
  };

  const onfileInput = (e) => {
    if (e.target.files?.length == 0) {
      return;
    }
    const file = e.target.files[0];
    const data = {};
    const reader = new FileReader();

    if (file.type?.includes("pdf")) {
      data["type"] = "pdf";
    }
    if (file.type?.includes("image")) {
      data["type"] = "image";
    }
    reader.onload = async (e) => {
      const text = e.target.result;
      data["content"] = text;
      setFiles([...files, data]);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <>
      <Header />
      <div className={styles.editor}>
        <div className={styles.info}>i</div>
        <div className={styles.board}>
          {files.map((f) => {
            if (f.type == "pdf") {
              return <PdfRenderer data={f} />;
            } else {
              return <img src={f.content} className={styles.imgType} />;
            }
          })}
          <div className={styles.adder} onClick={addFile}>
            <div className={styles.icon}>
              <img src={icon} />
            </div>
          </div>
          <input
            style={{ display: "none" }}
            ref={inputRef}
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={onfileInput}
          />
        </div>
      </div>
    </>
  );
};
