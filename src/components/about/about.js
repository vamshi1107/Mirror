import { Button, TextField } from "@mui/material";
import styles from "./about.module.css";
import icon from "../../assets/add-icon.png";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default () => {
  const [editable, setEditable] = useState(true);
  const [details, setDetails] = useState([]);

  const addDetail = () => {
    setDetails([...details, { label: "", content: "" }]);
  };

  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutHeader}>
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
      <div className={styles.editCon}>
        {details.map((d, i) => (
          <div className={styles.detailCon}>
            <TextField
              className={styles.detailLabel}
              label="Label"
              variant="standard"
            />
            <TextField
              className={styles.detailContent}
              label="Detail"
              variant="standard"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
