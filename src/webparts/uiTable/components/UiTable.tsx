import * as React from 'react';

function UiTable(props:any):any{
  return(
    <div>Hello world sub component {props.row.Title}</div>
  );
}

export default UiTable