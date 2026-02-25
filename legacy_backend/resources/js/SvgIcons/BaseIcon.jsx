import SvgIcon from '@mui/material/SvgIcon';

export default (props) => {
  return <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      {props.children}
    </svg>
  </SvgIcon>;
}