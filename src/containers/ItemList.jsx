import React, { useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DragIcon from '@material-ui/icons/DragIndicatorTwoTone';
import Item from './Item';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ExpandIcon from '@material-ui/icons/KeyboardArrowRight';
import CollapseIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';

function ItemList(props) {
  return (
    <Draggable
      key={props.question.id}
      draggableId={props.question.id}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            background: 'chocolate',
            // width: '492px',
            // marginBottom: 10,
            // padding: 10,
            // display: 'flex',
            // flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
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
          {props.question.content}
          <span {...provided.dragHandleProps}>
            <DragIcon size="small" />
          </span>
          <Droppable
            droppableId={`droppable${props.question.id}`}
            type={`${props.index}`}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  backgroundColor: 'green',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  userSelect: 'none',
                  width: '95%',
                }}
              >
                {props.question.answers.map((answer, index) => {
                  return (
                    <Item
                      id={uuidv4()}
                      item={{
                        name: 'tokyo revengers chapter 217',
                        type: 'standard',
                        data: '2021-07-31T09:00:00.000Z',
                        color: '#d1d1d1',
                      }}
                      onInterval={props.onInterval}
                      nestedIndex={props.index}
                      index={index}
                      answer={answer}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default ItemList;
