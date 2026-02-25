import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import InputLabel from "./InputLabel";

export default function MUIDropdown({
  label
  , labelId
  , id
  , value
  , onChange
  , options
  , optionKey
  , optionTitle
  , helperText
  , error
  , ...props}){
  return <FormControl>
    <InputLabel id={labelId}>{label}</InputLabel>
    <Select
      {...{
        error, labelId, id, value, onChange
      }}
      {...props}
    >
      {options.map((value, key) =>
        <MenuItem key={key} value={value[optionKey]}>
          {value[optionTitle]}
        </MenuItem>
      )}
    </Select>
    <FormHelperText error={error}>{helperText}</FormHelperText>
  </FormControl>
}