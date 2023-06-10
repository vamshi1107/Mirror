import { Button, Switch, TextField } from "@mui/material";
import styles from "./about.module.css";
import icon from "../../assets/add-icon.png";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useContext } from "react";
import * as Services from "../../services/services";
import appContext from "../../context/appContext";
import Modal from "../modal/modal";

export default ({ id, user }) => {
  const [editable, setEditable] = useState(false);
  const [details, setDetails] = useState([]);
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

  const onDetailChange = (e, key, index) => {
    let d = copy(details);
    d[index] = { ...d[index], [key]: e.target.value };
    setDetails([...d]);
  };

  const onMainChange = (e, key) => {
    let d = copy(mainDetails);
    d = { ...d, [key]: e.target.value };
    setMainDetails({ ...d });
  };

  const changeEditing = (e) => {
    setEditable(e.target.checked);
  };

  const createDetails = (ds) => {
    return Promise.all(
      ds
        .filter((d) => d?.status == "new")
        .filter((d) => d?.label.length > 0 && d?.content.length > 0)
        .map((m) => ({ label: m?.label, content: m?.content, user: id }))
        .map(async (i) => await Services.addDetail(i))
    );
  };

  const updateDetails = (ds) => {
    console.log(ds);
    return Promise.all(
      ds
        .filter((d) => d?.status != "new")
        .map((m) => ({
          id: m?.$id,
          data: { label: m?.label, content: m?.content, user: id },
        }))
        .map(async (i) => await Services.updateDetail(i?.id, i?.data))
    );
  };

  const saveDetails = async (e) => {
    setIsLoading(true);
    const cres = await createDetails(details);
    const ures = await updateDetails(details);
    console.log(mainDetails);
    const res = await Services.updateProfile(user?.$id, mainDetails);
    if (!res.error) {
      window.location.reload();
    }
  };

  const renderInputField = (detail, index) => (
    <div className={styles.detailCon}>
      <TextField
        className={styles.detailLabel}
        label="Label"
        variant="standard"
        value={detail?.label}
        onChange={(e) => onDetailChange(e, "label", index)}
      />
      <TextField
        className={styles.detailContent}
        variant="standard"
        value={detail?.content}
        onChange={(e) => onDetailChange(e, "content", index)}
      />
    </div>
  );

  const renderDisplayField = (details) => (
    <div className={styles.displayField}>
      <div className={styles.displayFieldLabel}>{details?.label}</div>
      <div className={styles.displayFieldContent}>{details?.content}</div>
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
            <TextField
              className={styles.detailLabel}
              variant="standard"
              value={"Name"}
              contentEditable={false}
            />
            <TextField
              className={styles.detailContent}
              variant="standard"
              value={user?.name}
              onChange={(e) => onMainChange(e, "name")}
            />
          </div>
          <div className={styles.detailCon}>
            <TextField
              className={styles.detailLabel}
              variant="standard"
              value={"Bio"}
              contentEditable={false}
            />
            <TextField
              className={styles.detailContent}
              variant="standard"
              value={user?.bio}
              onChange={(e) => onMainChange(e, "bio")}
            />
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
