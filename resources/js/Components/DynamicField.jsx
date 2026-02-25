import { TextField } from "@mui/material";

export default function DynamicField(props){
  let _fieldTmp;

  switch(props.type){
    case "password":
      _fieldTmp = <TextField {...props} type='password' />;
      break;
    case "dropdown":
      // render it yourself
      break;
    default:
      _fieldTmp = <TextField {...props} />;
  }

  return _fieldTmp;
}