import { Grid } from "@mui/material";
import React from "react";

export const defaultAdditional = {
  label_xs: 2,
  value_xs: 10,
  grid_spacing: 2,
  grid_container_sx: {},
  grid_item_sx: {}
}

export default function({entries, definitions = [], additional = {
  ...defaultAdditional
}}){

  const [keyValues,setKeyValues] = React.useState([]);

  React.useEffect(() => {
    const _keyValues = Object.entries(entries).map(([key, value]) => {
      const definition = definitions[key];
      let label = key;
      let valueDisplay = value;

      if (typeof definition === 'object') {
        if (definition['show'] === false) return;

        if (definition['title'] !== undefined) {
          label = definition['title'];
        }

        if (typeof definition['render'] === 'function') {
          valueDisplay = definition['render'](value);
        }
      }

      return {
        key, // for sortation purposes
        label,
        valueDisplay
      };
    }).filter(item => item !== undefined)
      .sort((a,b) => {
        const aIndex = Object.keys(definitions).indexOf(a.key);
        const bIndex = Object.keys(definitions).indexOf(b.key);
        return aIndex - bIndex;
      });
    setKeyValues(_keyValues);
  }, [entries, definitions]);

  return (
    keyValues.map((row, key) => {
      return <Grid key={key} container spacing={additional.grid_spacing}
        sx={additional.grid_container_sx}>
        <Grid sx={additional.grid_item_sx} item xs={additional.label_xs}>{row.label}</Grid>
        <Grid sx={additional.grid_item_sx} item xs={additional.value_xs}>{row.valueDisplay}</Grid>
      </Grid>
    })
  )
}