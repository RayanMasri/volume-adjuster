import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ExpandIcon from '@material-ui/icons/KeyboardArrowRight';
import CollapseIcon from '@material-ui/icons/KeyboardArrowDown';

function Item(props) {
  const [state, setState] = useState({
    collapse: false,
  });

  useEffect(() => {
    console.log('mount');
  }, [props.id]);

  const toggle = () => {
    setState({
      ...state,
      collapse: !state.collapse,
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        marginBottom: 10,
        backgroundColor: '#D1D1D1',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 'max-content',
          height: 'max-content',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
        }}
      >
        <IconButton size="small" onClick={props.onClose}>
          {state.collapse ? (
            <ExpandIcon onClick={toggle} />
          ) : (
            <CollapseIcon onClick={toggle} />
          )}
        </IconButton>
      </div>

      <div
        style={{
          height: '100%',
          width: '100%',
          textAlign: 'left',
          fontSize: '15px',
          padding: 5,
        }}
      >
        {props.title}
      </div>
      <div
        style={{
          width: 'max-content',
          height: 'max-content',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row-reverse',
          padding: 8,
        }}
      >
        <IconButton size="small" onClick={props.onClose}>
          <CloseIcon />
        </IconButton>

        <IconButton size="small" onClick={props.onEdit}>
          <EditIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Item;
