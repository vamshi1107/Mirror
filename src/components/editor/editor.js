import { useContext, useEffect, useRef, useState } from "react";
import Header from "../header/header";
import styles from "./editor.module.css";
import { Document, Page } from "react-pdf";
import PdfRenderer from "../pdfRenderer/pdfRenderer";
import icon from "./add-icon.png";
import * as Services from "../../services/services";
import { useNavigate } from "react-router-dom";
import appContext from "../../context/appContext";
import { Button, Chip, TextField } from "@mui/material";

export default () => {
  const [files, setFiles] = useState([]);
  const [labels, setLabels] = useState([]);
  const [content, setContent] = useState({});
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
    if (e.key == "Enter") {
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
    let user = context.data?.info?.["$id"];
    let project = {
      ...content,
      labels: labels,
      user: user,
      created: new Date().getTime().toString(),
    };
    let fileresp = await Promise.all(
      files.map((f) => {
        return uploadFiles(f?.fileObj);
      })
    );
    let coverId = await uploadFiles(coverObj);
    project["files"] = fileresp;
    project["cover"] = coverId;
    const res = await Services.addProject(project);
    if (res?.["$id"]) {
      navigate("/" + user);
    }
  };

  const renderInfo = () => {
    return (
      <div className={styles.info}>
        <div className={styles.cover} onClick={addCover}>
          {cover.length > 0 && <img src={cover} />}
          {cover.length == 0 && <div>Add cover Image</div>}
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
                onDelete={(e) => labelDelete(e, i)}
              ></Chip>
            ))}
          </div>
          <TextField
            label="Project Name"
            variant="standard"
            onChange={(e) => fillContent(e, "name")}
            className={styles.field}
            multiline={true}
            minRows={3}
          ></TextField>
          <TextField
            label="Description"
            variant="standard"
            onChange={(e) => fillContent(e, "description")}
            multiline={true}
            minRows={3}
            className={styles.field}
          ></TextField>

          <TextField
            label="Labels"
            variant="standard"
            onKeyDown={(e) => addLabels(e)}
            className={styles.field}
            multiline={true}
            minRows={3}
          ></TextField>
        </div>
        <div>
          <button onClick={createProject}>Create</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.editor}>
        <div className={styles.board}>
          {files.map((f, i) => {
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
        {renderInfo()}
      </div>
    </>
  );
};
