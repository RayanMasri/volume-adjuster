import React from 'react';
import IconButton from '@material-ui/core/IconButton';

function StyledIconButton(props) {
  return (
    <div
      style={{
        width: 'max-content',
        height: 'max-content',
        backgroundColor: '#D1D1D1',
        borderRadius: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'all',
      }}
    >
      <IconButton onClick={props.onClick}>{props.children}</IconButton>
    </div>
  );
}

export default StyledIconButton;
