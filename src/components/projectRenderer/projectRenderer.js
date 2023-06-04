import { Chip } from "@mui/material";
import PdfRenderer from "../pdfRenderer/pdfRenderer";
import styles from "./projectRenderer.module.css";

export default ({ project }) => {
  return (
    <div>
      <div className={styles.projectInfo}>
        <div className={styles.avatar}>
          <img src={project?.cover} />
        </div>
        <div>
          <div className={styles.pname}>{project.name}</div>
          <div className={styles.pdesc}>{project.description}</div>
          <div className={styles.plabels}>
            {project?.labels?.map((l) => (
              <Chip label={l} variant="outlined" color="primary"></Chip>
            ))}
          </div>
        </div>
      </div>
      {project?.files.map((f, i) => {
        if (f.mimeType?.includes("pdf")) {
          return <PdfRenderer data={{ content: f.src }} />;
        } else {
          return <img src={f.src} className={styles.imgType} loading="lazy" />;
        }
      })}
    </div>
  );
};
