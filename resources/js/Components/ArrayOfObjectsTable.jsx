import { Box, Divider
  , Paper
  , Table
  , TableBody
  , TableCell
  , TableContainer
  , TableHead
  , TableRow
  , Typography } from "@mui/material";
import React from "react";
import { HidableComponent } from "./HidableComponent";
import { underscoreToTitleCase } from "@/Helpers/String";

const checkCustomization = (customizations, field, customizationKey, assertTypeOf) => {
  if(customizations == undefined) return false;

  if(customizations[field] == undefined) return false;

  if(customizations[field][customizationKey] == undefined) return false;

  if(typeof customizations[field][customizationKey] != assertTypeOf) return false;

  return true;
}

const CustomizedTableCell = function(props){

  const style = {}

  if (props.defaults?.style?.fontSize)
    style.fontSize = props.defaults.style.fontSize;

  return <TableCell {...props}
    style={style}></TableCell>
}

const TableRenderer = (props) => {
  const { lines, customizations, defaults = {}, getRowProps } = props;
  if(lines.length == 0)
    return <Typography sx={{ fontSize: "1em", textAlign: "center" }}>empty result set</Typography>;

  return <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          {Object.keys(lines[0]).map((title, key) => (
            !checkCustomization(customizations, title, "hidden", "boolean") || !customizations[title]["hidden"] ? (
              <CustomizedTableCell
                defaults={defaults}
                key={key}
                align={checkCustomization(customizations, title, "align", "string")
                  ? customizations[title]["align"]
                  : (defaults.align ?? "left")}>
                {checkCustomization(customizations, title, "header", "string")
                  ? customizations[title]["header"]
                  : underscoreToTitleCase(title)}
              </CustomizedTableCell>
            ) : null
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {lines.map((el, elk) => (
          <TableRow key={elk}
            {...(typeof getRowProps === 'function' ? getRowProps(el, elk) : {})}
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, ...(typeof getRowProps === 'function' && getRowProps(el, elk)?.sx) }}>
            {Object.keys(el).map((elField, elFieldKey) => (
              !checkCustomization(customizations, elField, "hidden", "boolean") || !customizations[elField]["hidden"] ? (
                <CustomizedTableCell
                  defaults={defaults}
                  key={elFieldKey} align={
                  checkCustomization(customizations, elField, "align", "string")
                    ? customizations[elField]["align"]
                    : (defaults.align ?? "left")
                }>
                  {
                    checkCustomization(customizations, elField, "render", "function")
                      ? customizations[elField]["render"](el[elField])
                      : el[elField]
                  }
                </CustomizedTableCell>
              ) : null
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
}

const reorderColumnsBasedOnCustomizations = (lines, customizations) => {
  const order = Object.keys(customizations);

  return lines.map(item => {
    const reordered = {};

    // Add properties based on customization order
    order.forEach(key => {
      if (key in item) {
        reordered[key] = item[key];
      }
    });

    // Add remaining properties not in customization order
    Object.keys(item).forEach(key => {
      if (!reordered.hasOwnProperty(key)) {
        reordered[key] = item[key];
      }
    });

    return reordered;
  });
};

export default function ArrayOfObjectsTable(props){
  const { lines, name, hidable, customizations = {}, getRowProps } = props;

  const reorderedLines = reorderColumnsBasedOnCustomizations(lines, customizations);

  const enhancedTableProps = {
    ...props,
    lines: reorderedLines,
    getRowProps
  }

  const core = <React.Fragment>
    {/* <Typography sx={{ fontSize: "1em" }}>{name} ({lines.length} row{lines.length !== 1 ? "s" : ""})</Typography> */}
    <Divider>
      <Typography sx={{ fontSize: "1em", textTransform: "capitalize", textAlign: "center" }}>{name}</Typography>
    </Divider>
    <TableRenderer {...enhancedTableProps} />
  </React.Fragment>

  const content = hidable ? <HidableComponent component={Box}>{core}</HidableComponent> : core;

  return <Paper variant='outlined' sx={{ p: 1 }}>{content}</Paper>
}