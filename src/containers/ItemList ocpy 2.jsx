import React, { useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Item from './Item';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ExpandIcon from '@material-ui/icons/KeyboardArrowRight';
import CollapseIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';

function ItemList(props) {
  const [state, setState] = useState({
    collapse: false,
  });

  useEffect(() => {
    console.log('mount');
  }, [props.uuid]);

  const toggle = () => {
    let bool = !state.collapse;

    if (bool) {
      props.onCollapse(props.data.title);
    } else {
      props.onExpand(props.data.title);
    }

    setState({
      ...state,
      collapse: bool,
    });
  };

  return (
    <Droppable droppableId={props.data.title} isDragDisabled={state.collapse}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{
            background: 'chocolate',
            width: '492px',
            marginBottom: 10,
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              userSelect: 'none',
              marginBottom: 10,
              backgroundColor: props.data.color || '#D1D1D1',
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

              <IconButton
                size="small"
                onClick={() => {
                  props.onAppend(props.data.title);
                }}
              >
                <AddIcon />
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
              {props.data.title}
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

          {!state.collapse &&
            props.data.items.map((item, index) => {
              return (
                <Draggable
                  key={item.name}
                  draggableId={item.name}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        userSelect: 'none',
                        width: '95%',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {/* <Item
                      id={uuidv4()}
                      item={item}
                      onClose={() => {
                        props.self.clearIntervals();
                        props.self.delete(value.index);
                      }}
                      onEdit={() => {
                        props.self.requestEdit(value.index);
                      }}
                      onInterval={(id) => {
                        props.self.intervals.push(id);
                      }}
                    /> */}
                      <Item
                        id={uuidv4()}
                        item={item}
                        onInterval={props.onInterval}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default ItemList;
