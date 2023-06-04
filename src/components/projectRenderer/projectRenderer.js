import PdfRenderer from "../pdfRenderer/pdfRenderer";
import styles from "./projectRenderer.module.css";

export default ({ project }) => {
  return (
    <div>
      {project?.files.map((f, i) => {
        if (f.mimeType?.includes("pdf")) {
          return <PdfRenderer data={{ content: f.src }} />;
        } else {
          return <img src={f.content} className={styles.imgType} />;
        }
      })}
    </div>
  );
};
