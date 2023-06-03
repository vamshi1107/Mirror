import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import styles from "./pdfRenderer.module.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default (props) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className={styles.document}>
      <Document
        file={props.data.content}
        onLoadSuccess={onDocumentLoadSuccess}
        style={{ width: "100" }}
      >
        {Object.keys([...new Array(numPages)]).map((e) => (
          <Page pageNumber={pageNumber} className={styles.page} />
        ))}
      </Document>
    </div>
  );
};
