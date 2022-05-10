import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const DocViewerComponent = ({ src, width, height, isHeader }) => {
  let checkFormat = src;
  let splitElements = checkFormat.split(".");
  let extension = splitElements[splitElements?.length - 1];
  return (
    <DocViewer
      pluginRenderers={DocViewerRenderers}
      documents={[{ uri: src, fileType: extension }]}
      style={{
        height: height ? height : window.screen.height,
        width: "100%",
        paddingTop: width !== "100%" ? 80 : 0,
      }}
      theme={{
        disableThemeScrollbar: true,
      }}
      config={{
        header: {
          disableHeader: isHeader ? false : true,
          disableFileName: false,
          retainURLParams: true,
        },
      }}
      className={`${isHeader ? "" : "doc-viewer-download-disabled"}`}
    />
  );
};

export default DocViewerComponent;
