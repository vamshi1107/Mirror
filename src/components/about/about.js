import { Button, Switch, TextField } from "@mui/material";
import styles from "./about.module.css";
import icon from "../../assets/add-icon.png";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useContext, useMemo } from "react";
import * as Services from "../../services/services";
import appContext from "../../context/appContext";
import Modal from "../modal/modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default ({ id, user }) => {
  const [editable, setEditable] = useState(false);
  const [details, setDetails] = useState([]);
  const [detailsCopy, setDetailsCopy] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const context = useContext(appContext);
  const [mainDetails, setMainDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDetails();
    setIsAuth(isUser());
  }, [id]);

  const loadDetails = async () => {
    const res = await Services.getDetailsByUserId(id);
    if (!res?.error) {
      setDetails(res.documents);
      setDetailsCopy(res.documents);
      setMainDetails({
        name: user?.name,
        bio: user?.bio,
      });
    }
  };

  const isUser = () => {
    let user = context?.data?.info?.["$id"];
    return context?.data?.login && id == user;
  };

  const addDetail = () => {
    setDetails([
      ...details,
      { label: "", content: "", status: "new", user: id },
    ]);
  };

  const copy = (d) => JSON.parse(JSON.stringify(d));

  const onDetailChange = (value, key, index, rich) => {
    let d = copy(details);
    d[index] = { ...d[index], [key]: rich ? value.getHTML() : value };
    setDetails([...d]);
  };

  const onMainChange = (e, key, rich) => {
    let value = rich ? e.getHTML() : e.target.value;
    let d = copy(mainDetails);
    d = { ...d, [key]: value };
    setMainDetails({ ...d });
  };

  const changeEditing = (e) => {
    context?.updateData({ ...context?.data, editing: e.target.checked });
    setEditable(e.target.checked);
  };

  const createDetails = (ds) => {
    return Promise.all(
      ds
        .filter((d) => d?.status == "new")
        .filter((d) => d?.label.length > 0 && d?.content.length > 0)
        .map((m) => ({ label: m?.label, content: m?.content, user: id }))
        .map((e) => {
          console.log(e);
          return e;
        })
        .map(async (i) => await Services.addDetail(i))
    );
  };

  const validUpdate = (e) => {
    const copy = detailsCopy.find((d) => d["$id"] == e?.id);
    if (copy.label !== e?.data?.label || copy.content !== e?.data?.content) {
      return true;
    }
    return false;
  };

  const updateDetails = (ds) => {
    return Promise.all(
      ds
        .filter((d) => d?.status != "new")
        .map((m) => ({
          id: m?.$id,
          data: { label: m?.label, content: m?.content },
        }))
        .filter((e) => {
          return validUpdate(e);
        })
        .map((e) => {
          console.log(e);
          return e;
        })
        .map(async (i) => await Services.updateDetail(i?.id, { ...i?.data }))
    );
  };

  const uploadFiles = async (file) => {
    const res = await Services.storeFile(file);
    if (res.error) {
      return "";
    }
    return res?.["$id"];
  };

  const saveDetails = async (e) => {
    setIsLoading(true);
    const cres = await createDetails(details);
    const ures = await updateDetails(details);
    const contextData = context?.data;
    let payload = { ...mainDetails };
    if (contextData?.updatedAvatar?.length > 0 && contextData?.avatarFile) {
      const file = await uploadFiles(contextData?.avatarFile);
      payload = { ...payload, avatar: file };
    }
    const res = await Services.updateProfile(user?.$id, payload);
    if (!res.error) {
      context?.updateData({
        ...context?.data,
        updatedAvatar: "",
        avatarFile: undefined,
        editing: false,
      });
      window.location.reload();
    }
  };

  const renderInputField = (detail, index) => {
    return (
      <div className={styles.detailCon} key={index}>
        <TextField
          className={styles.detailLabel}
          label="Label"
          variant="standard"
          value={detail?.label}
          onChange={(e) =>
            onDetailChange(e?.target?.value, "label", index, false)
          }
        />
        <ReactQuill
          value={detail?.content}
          className={styles.detailContent}
          onChange={(content, delta, source, editor) =>
            onDetailChange(editor, "content", index, true)
          }
        ></ReactQuill>
      </div>
    );
  };

  const renderDisplayField = (details) => (
    <div className={styles.displayField}>
      <div className={styles.displayFieldLabel}>{details?.label}</div>
      <div
        className={styles.displayFieldContent}
        dangerouslySetInnerHTML={{ __html: details?.content }}
      ></div>
    </div>
  );

  return (
    <div className={styles.aboutPage}>
      {isAuth && (
        <div className={styles.aboutHeader}>
          <div className={styles.switch}>
            <div>Enable editing</div>
            <Switch onChange={(e) => changeEditing(e)} />
          </div>
          {editable && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => addDetail(e)}
            >
              Add Detail
            </Button>
          )}
        </div>
      )}
      {editable && (
        <div className={styles.editCon}>
          <div className={styles.detailCon}>
            <div className={styles.detailLabel}>Name</div>
            <TextField
              className={styles.detailContent}
              variant="standard"
              value={user?.name}
              onChange={(e) => onMainChange(e, "name", false)}
            />
          </div>
          <div className={styles.detailCon}>
            <div className={styles.detailLabel}>Bio</div>
            <ReactQuill
              className={styles.detailContent}
              value={mainDetails?.bio}
              onChange={(content, delta, source, editor) =>
                onMainChange(editor, "bio", true)
              }
            ></ReactQuill>
          </div>
          {details.map((d, i) => renderInputField(d, i))}
        </div>
      )}
      {editable && (
        <div className={styles.saveButon}>
          <Button
            variant="contained"
            onClick={(e) => {
              saveDetails(e);
            }}
          >
            Save
          </Button>
        </div>
      )}
      {!editable && (
        <div className={styles.displayCon}>
          {renderDisplayField({ label: "Name", content: user?.name })}
          {renderDisplayField({ label: "Bio", content: user?.bio })}
          {details.map((d) => renderDisplayField(d))}
        </div>
      )}
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
    </div>
  );
};
