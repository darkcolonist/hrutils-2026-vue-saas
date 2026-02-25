import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import { useForm } from '@inertiajs/react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReportIcon from '@mui/icons-material/Report';
import DeleteButtonBase from '@/Components/DeleteButton';
import Numeric, { defaultNumericColumnDef } from '@/Components/Numeric';
import CustomDialog from '@/Components/CustomDialog';
import CustomJsonView from '@/Components/JsonView';

const ErrorReportButton = ({cacheObject, ...props}) => {
  if(!cacheObject || !cacheObject.last_error) return;

  const dialogContent = <Box>
    <Typography variant='body2'>
      logged <RealtimeTimestamp>{cacheObject.errored_at}</RealtimeTimestamp>
    </Typography>
    <CustomJsonView src={cacheObject.last_error} />
  </Box>

  const title = `an error occured during warmup for ${cacheObject.id}`;

  return (
    <CustomDialog
      buttonLabel={
        <IconButton
          title={title}
          color='warning'
        >
          <ReportIcon />
        </IconButton>
      }
      dialogContent={dialogContent}
      dialogTitle={title}
    />
  );
};

const RefreshButton = ({ cacheKey, ...props }) => {
  const { patch } = useForm();
  const [isDisabled, setIsDisabled] = React.useState(false);

  const updateCache = async (cacheKey) => {
    setIsDisabled(true);
    await patch(route('dev.cache.patch', { cacheKey }), {
      onFinish: () => {
        setIsDisabled(false);
      }
    });
  };

  return (
    <IconButton
      onClick={() => updateCache(cacheKey)}
      disabled={isDisabled}
      title={`force fetch new updates for ${cacheKey}`}
      color='warning'
      {...props}
    >
      <RefreshIcon />
    </IconButton>
  );
};

const DeleteButton = ({cacheKey, ...props}) => {
  const {
    delete: destroy
  } = useForm();

  const forgetCache = (cacheKey) => {
    // console.debug(cacheKey);

    destroy(route('dev.cache.destroy', {
      cacheKey
    }));
  }

  return <DeleteButtonBase
    confirmMessage={<React.Fragment>
      <Typography paragraph>This will remove the cache forcing the next visit to be loaded freshly.</Typography>
      <Typography paragraph>Proceed to forget <code>{cacheKey}</code>?</Typography>
    </React.Fragment>}
    confirmTitle={`Forget ${cacheKey}`}
    customAction={() => forgetCache(cacheKey)}
    isIconButton
  >Forget</DeleteButtonBase>
};

const getActions = (params) => {
  return <React.Fragment>
    <RefreshButton cacheKey={params.id} />
    <DeleteButton cacheKey={params.id} />
    <ErrorReportButton cacheObject={params.row} />
  </React.Fragment>
}

export default function DevCacheTable({rows, ...props }) {
  const columns = [
    { field: "id", headerName: "Key", width: 250 },
    { field: "ttl", headerName: "TTL (sec)"
      , width: 50
      , ...defaultNumericColumnDef
    },
    { field: "warm_up_every", headerName: "Every (sec)"
      , width: 50
      , ...defaultNumericColumnDef
    },
    { field: "last_warmed_at", headerName: "Last Warmed At"
      , renderCell: params => <RealtimeTimestamp>{params.value}</RealtimeTimestamp>
      , width: 150
    },
    { field: "last_ping", headerName: "Last Ping"
      , renderCell: params => <RealtimeTimestamp>{params.value}</RealtimeTimestamp>
      , width: 150
    },
    { field: "execution_time", headerName: "Execution Time (sec)"
      , ...defaultNumericColumnDef
      , renderCell: params => <Numeric decimals={2}>{params.value}</Numeric>
    },
    { field: "last_ping_by", headerName: "Who"
      , width: 50
      , renderCell: params => (
        <Avatar src={params.row.last_ping_by_avatar} sx={{
          width: 24,
          height: 24,
        }} title={`last visit by ${params.value}`} />
      )
    },
    {
      field: "expires", headerName: "Expires"
      , renderCell: params => <RealtimeTimestamp>{params.value}</RealtimeTimestamp>
      , width: 75
    },
    { field: "total_pings", headerName: "Pings"
      , width: 50
      , ...defaultNumericColumnDef
    },
    { field: "actions", headerName: ""
      , renderCell: getActions
      , width: 150
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      rowCount={rows.length}
      pageSizeOptions={[rows.length]}
      disableColumnMenu
      autoHeight
    />
  );
}