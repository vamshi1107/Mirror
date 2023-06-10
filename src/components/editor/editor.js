import { useContext, useEffect, useRef, useState } from "react";
import Header from "../header/header";
import styles from "./editor.module.css";
import { Document, Page } from "react-pdf";
import PdfRenderer from "../pdfRenderer/pdfRenderer";
import icon from "../../assets/add-icon.png";
import * as Services from "../../services/services";
import { useNavigate } from "react-router-dom";
import appContext from "../../context/appContext";
import { Button, Chip, FormHelperText, TextField } from "@mui/material";
import Modal from "../modal/modal";

export default () => {
  const [files, setFiles] = useState([]);
  const [labels, setLabels] = useState([]);
  const [content, setContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [cover, setCover] = useState("");
  const [coverObj, setCoverObj] = useState(null);
  const inputRef = useRef();
  const coverRef = useRef();
  const navigate = useNavigate();
  const context = useContext(appContext);

  useEffect(() => {
    validateUser();
  }, []);

  const validateUser = async () => {
    if (!context.data.login) {
      context?.setPrev("/editor");
      navigate("/login");
    } else {
      context?.clearPrev();
    }
  };

  const addFile = () => {
    inputRef.current.click();
  };

  const addCover = () => {
    coverRef.current.click();
  };

  const onfileInput = (e) => {
    if (e.target.files?.length == 0) {
      return;
    }
    const file = e.target.files[0];
    const data = {};
    const reader = new FileReader();
    data["fileObj"] = file;
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

  const onCoverInput = (e) => {
    if (e.target.files?.length == 0) {
      return;
    }
    const file = e.target.files[0];
    setCoverObj(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setCover(text);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const fillContent = (e, name) => {
    let value = e.target.value;
    setContent({ ...content, [name]: value });
  };

  const addLabels = (e) => {
    if (e.key == "Enter" && e.target.value.length > 0) {
      setLabels([...labels, e.target.value]);
      e.target.value = "";
    }
  };

  const labelDelete = (e, index) => {
    let c = [...labels];
    c.splice(index, 1);
    setLabels([...c]);
  };

  const uploadFiles = async (file) => {
    const res = await Services.storeFile(file);
    if (res.error) {
      return "";
    }
    return res?.["$id"];
  };

  const createProject = async () => {
    setIsLoading(true);
    let user = context.data?.info?.["$id"];
    let project = {
      ...content,
      labels: labels,
      user: user,
      created: new Date().getTime().toString(),
    };
    let fileresp = {};
    if ((content && !content?.name) || content?.name?.length == 0) {
      setIsLoading(false);
      setAlertMsg("Add name to project");
      setShowAlert(true);
      return;
    }
    if (files.length == 0) {
      setIsLoading(false);
      setAlertMsg("Add files to project");
      setShowAlert(true);
      return;
    } else {
      fileresp = await Promise.all(
        files.map((f) => {
          return uploadFiles(f?.fileObj);
        })
      );
    }
    let coverId = "";
    if (coverObj) {
      coverId = await uploadFiles(coverObj);
    } else {
      setIsLoading(false);
      setAlertMsg("Add cover to project");
      setShowAlert(true);
      return;
    }
    project["files"] = fileresp;
    project["cover"] = coverId;
    const res = await Services.addProject(project);
    if (res?.["$id"]) {
      navigate("/" + user);
    }
  };

  const onFileRemove = (e, index) => {
    let c = [...files];
    c.splice(index, 1);
    setFiles([...c]);
  };

  const renderInfo = () => {
    return (
      <div className={styles.info}>
        <div className={styles.cover} onClick={addCover}>
          {cover.length > 0 && <img src={cover} />}
          {cover.length == 0 && (
            <div className={styles.createLabel}> Add cover Image</div>
          )}
          <input
            style={{ display: "none" }}
            ref={coverRef}
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={onCoverInput}
          />
        </div>
        <div className={styles.fields}>
          <div className={styles.labels}>
            {labels.map((l, i) => (
              <Chip
                label={l}
                variant="outlined"
                color="primary"
                onDelete={(e) => labelDelete(e, i)}
              ></Chip>
            ))}
          </div>
          <TextField
            label="Project Name"
            variant="outlined"
            onChange={(e) => fillContent(e, "name")}
            className={styles.field}
            multiline={true}
            minRows={3}
          ></TextField>
          <TextField
            label="Description"
            variant="outlined"
            onChange={(e) => fillContent(e, "description")}
            multiline={true}
            minRows={3}
            className={styles.field}
          ></TextField>

          <TextField
            label="Labels"
            variant="outlined"
            onKeyDown={(e) => addLabels(e)}
            className={styles.field}
          ></TextField>
          <FormHelperText>Click enter to add label</FormHelperText>
        </div>
        <div>
          <button
            onClick={createProject}
            className={styles.createLabel + " " + styles.createProject}
            disabled={isLoading}
          >
            Create
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.editor}>
        <div className={styles.board}>
          {files.map((f, i) => (
            <>
              <div className={styles.filehead}>
                <div
                  onClick={(e) => onFileRemove(e, i)}
                  className={styles.closeCon}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 8.09 8.08"
                    className={styles.close}
                  >
                    <path d="M5.18 4.05L7.84 6.7a.75.75 0 0 1 .2.27.88.88 0 0 1 0 .31.83.83 0 0 1-.06.3.63.63 0 0 1-.18.27.42.42 0 0 1-.12.11l-.15.08h-.15a.72.72 0 0 1-.3 0h-.15l-.15-.08a.41.41 0 0 1-.12-.11L4.04 5.18 1.37 7.84a.42.42 0 0 1-.12.11l-.15.08H.95a.72.72 0 0 1-.3 0H.5l-.15-.08a.41.41 0 0 1-.12-.11.63.63 0 0 1-.19-.26.83.83 0 0 1 0-.3.88.88 0 0 1 0-.31.75.75 0 0 1 .18-.27L2.9 4.05.24 1.38a.63.63 0 0 1-.2-.27.83.83 0 0 1 0-.3.88.88 0 0 1 0-.29.75.75 0 0 1 .18-.27.73.73 0 0 1 .27-.18.84.84 0 0 1 .61 0 .73.73 0 0 1 .27.18l2.67 2.66L6.71.24a.73.73 0 0 1 .27-.18.84.84 0 0 1 .61 0 .73.73 0 0 1 .27.18.75.75 0 0 1 .18.28.88.88 0 0 1 0 .29.83.83 0 0 1-.06.3.63.63 0 0 1-.18.27L5.18 4.05z"></path>
                  </svg>
                </div>
              </div>
              {f.type == "pdf" ? (
                <PdfRenderer data={f} />
              ) : (
                <img src={f.content} className={styles.imgType} />
              )}
            </>
          ))}
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
        {renderInfo()}
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
        {showAlert && (
          <Modal
            showBg={false}
            showClose={true}
            default={true}
            onClose={() => setShowAlert(false)}
          >
            <div className={styles.alert}>{alertMsg}</div>
          </Modal>
        )}
      </div>
    </>
  );
};
