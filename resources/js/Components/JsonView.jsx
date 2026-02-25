import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import 'react18-json-view/src/dark.css'
import React from 'react';
import { Box } from '@mui/material';

export default function CustomJsonView({ src, collapsed = false
  , maxHeight = null
  , ...props }) {
  return (
    <Box sx={{
      maxHeight,
      overflowY: 'auto'
    }}>
      <JsonView dark enableClipboard={false} src={src}
        collapsed={collapsed}
      />
    </Box>
  );
}