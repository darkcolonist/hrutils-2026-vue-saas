import React from 'react';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import CustomJsonView from './JsonView';

export default function AxiosWrapper({ method = "post"
  , routeName
  , params
  , after
  , afterCallback
  , ...props }) {
  const [loading, setLoading] = React.useState(true);
  const [loadedData, setLoadedData] = React.useState(null);
  const cancelToken = React.useRef(null);

  if (typeof after !== 'function')
    after = data => <CustomJsonView src={data} />

  const handleDataReady = ({ data }) => {
    setLoadedData(data);
    setLoading(false);

    if (typeof afterCallback === 'function')
      afterCallback(data);
  }

  React.useEffect(() => {
    cancelToken.current = axios.CancelToken.source();

    axios[method](route(routeName, params), {
      cancelToken: cancelToken.current.token
    })
      .then(handleDataReady)
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          // Handle other errors
        }
      });

    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel('Component unmounted');
      }
    };
  }, []);

  return (
    loading ?
      <LinearProgress /> :
      <>{after(loadedData)}</>
  );
}