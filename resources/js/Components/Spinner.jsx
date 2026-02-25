import React from 'react';
import '../../css/spinner.css';

export default function Spinner({ style = {}, ...props }) {
  return (
    <div className="lds-spinner" style={style}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  );
}