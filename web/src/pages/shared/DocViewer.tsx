import React from "react";
import DocViewer from "../../common/DocViewer";
import { useLocation } from "react-router";

const DocViewerComponent = () => {
  let location = useLocation();
  console.log({ location });

  const params = new URLSearchParams(location?.search);
  const Url = params.get("url");
  const isHeader = params.get("header");
  console.log({ Url });
  return (
    <div>
      <DocViewer
        src={Url}
        width={window.screen.width}
        height={window.screen.height}
        isHeader={isHeader}
      />
    </div>
  );
};

export default DocViewerComponent;
