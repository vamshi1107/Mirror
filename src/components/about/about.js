import { Button, Switch, TextField } from "@mui/material";
import styles from "./about.module.css";
import icon from "../../assets/add-icon.png";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useContext } from "react";
import { getDetailsByUserId } from "../../services/services";
import appContext from "../../context/appContext";

export default ({ id, user }) => {
  const [editable, setEditable] = useState(false);
  const [details, setDetails] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const context = useContext(appContext);

  useEffect(() => {
    loadDetails();
    setIsAuth(isUser());
  }, [id]);

  const loadDetails = async () => {
    // const res = await getDetailsByUserId(id);
    // if (!res?.error) {
    //   setDetails(res.documents);
    // }
  };

  const isUser = () => {
    let user = context?.data?.info?.["$id"];
    return context?.data?.login && id == user;
  };

  const addDetail = () => {
    setDetails([...details, { label: "", content: "", status: "new" }]);
  };

  const copy = (d) => JSON.parse(JSON.stringify(d));

  const onDetailChange = (e, key, index) => {
    let d = copy(details);
    d[index] = { ...d[index], [key]: e.target.value };
    setDetails([...d]);
  };

  const changeEditing = (e) => {
    setEditable(e.target.checked);
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
            />
          </div>
          {details.map((d, i) => renderInputField(d, i))}
        </div>
      )}
      {!editable && (
        <div className={styles.displayCon}>
          {renderDisplayField({ label: "Name", content: user?.name })}
          {renderDisplayField({ label: "Bio", content: user?.bio })}
          {details.map((d) => renderDisplayField(d))}
        </div>
      )}
    </div>
  );
};
