import { Divider, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

export default function AnnouncementContainer({ children,
  header = null, footer = null}) {
  return <React.Fragment>
    {header && (
      <React.Fragment>
        <Typography variant="h6">{header}</Typography>
        <Divider />
      </React.Fragment>
    )}
    <Typography variant="body2">{children}</Typography>
    {footer && (
      <React.Fragment>
        <Typography variant="subtitle2" sx={{fontSize: '.7em', color: grey[600]}}>{footer}</Typography>
      </React.Fragment>
    )}
  </React.Fragment>
}