import { format } from "@/Helpers/Number";

const Numeric = ({ children, decimals = 0
  , codeStyle = {}
  , ...props }) => {

  const defaultCodeStyle = {
    color: "green",
    backgroundColor: "#181818",
    border: "1px solid darkgreen",
    padding: "1px 4px",
    borderRadius: "10px"
  };

  const mergedCodeStyle = { ...defaultCodeStyle, ...codeStyle };

  return <code style={mergedCodeStyle}
    title={children}
  >{format(children, decimals)}</code>;
};

export default Numeric;

export const defaultNumericColumnDef = {
  headerAlign: 'right'
  , align: 'right'
  , renderCell: params => <Numeric>{params.value}</Numeric>
};