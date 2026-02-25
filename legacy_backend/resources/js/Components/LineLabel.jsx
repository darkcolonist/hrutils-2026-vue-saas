import React from "react";

const LineLabel = function (props) {
  return <span style={{ opacity: .7, fontSize: ".9em" }}>{props.children}</span>;
}

export default LineLabel;