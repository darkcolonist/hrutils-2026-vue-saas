import { LinearProgress } from "@mui/material";
import React from "react";
// import MyUtil from "./MyUtil";

const defaultTimeout = 60 * 1000;
// const defaultTimeout = 5000; // for testing
const countDownIntervals = 250;
const showDuration = .5;
const hideDuration = 1;

export const HidableComponent = function({hidden, ...props}){
  const [hideContents, setHideContents] = React.useState(hidden === undefined ? true : hidden);
  // const [timer, setTimer] = React.useState(null);
  const [countDownTimer,setCountDownTimer] = React.useState(null);
  const [timeRemainingDisplay,setTimeRemainingDisplay] = React.useState(null);
  const [currentTimeout, setCurrentTimeout] = React.useState(props.timeout || defaultTimeout);

  React.useEffect(() => {
    if(!hidden)
      handleClick();
  },[]);

  const countDownTicker = (timeRemaining) => {
    const ticker = setTimeout(() => {
      const updatedTimeRemaining = timeRemaining - countDownIntervals;
      setTimeRemainingDisplay(updatedTimeRemaining);

      if (updatedTimeRemaining > 0)
        countDownTicker(updatedTimeRemaining);
      else{
        setHideContents(true);
        clearTimeout(ticker);
      }
    }, countDownIntervals);

    setCountDownTimer(ticker);
  }

  const resetCurrentTimeout = () => {
    setCurrentTimeout(props.timeout || defaultTimeout);
  }

  const clearAllTimeouts = () => {
    // clearTimeout(timer);
    clearTimeout(countDownTimer);
  }

  const handleClick = () => {
    // console.debug('unhiding');
    setTimeRemainingDisplay(currentTimeout);
    clearAllTimeouts();
    resetCurrentTimeout();
    setHideContents(false);
    countDownTicker(currentTimeout)
  };

  const getOverallDuration = () => (currentTimeout + showDuration + hideDuration);

  const getRemainingPercent = () => {
    return Math.ceil((timeRemainingDisplay / getOverallDuration())*100);
  }

  React.useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return <React.Fragment>
    {hideContents ? null : <LinearProgress
      color="warning"
      sx={{height: "2px"}}
      variant="determinate" value={getRemainingPercent()} />}

    <props.component {...props}
      sx={{
        ...props.sx,
        filter: hideContents ? "blur(10px)" : "",
        transition: hideContents ? `filter ${hideDuration}s` : `filter ${showDuration}s`,
        userSelect: "none"
      }}

      onClick={handleClick}
    />
  </React.Fragment>
}