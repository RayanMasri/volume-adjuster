import React, { useRef, useEffect, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import DragIcon from '@material-ui/icons/DragIndicatorTwoTone';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getTextColor } from './Methods.jsx';

const useStyles = makeStyles((theme) => ({
  buttonLight: {
    color: 'white',
  },
  buttonDark: {
    color: 'black',
  },
}));

function Item(props) {
  let [state, setState] = useState({});

  const classes = useStyles();
  let interval = useRef(null);

  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const getIntervalData = () => {
    const diff = (Date.now() - props.item.data.initial) / 1000;
    let milliseconds = props.item.data.days * 86400 * 1000;
    let completed = Math.floor(diff / (milliseconds / 1000));

    return {
      completed: `Goals reached: ${completed < 0 ? 0 : completed}`,
      next:
        diff >= 0
          ? `Next goal: ${dayjs(
              new Date(
                props.item.data.initial.getTime() +
                  milliseconds * completed +
                  milliseconds
              )
            ).fromNow()}`
          : `Reaching initial date: ${dayjs(
              new Date(Date.parse(props.item.data.initial))
            ).fromNow()}`,
      last:
        completed > 0 && diff >= 0
          ? `Last goal: ${dayjs(
              new Date(
                props.item.data.initial.getTime() +
                  milliseconds * completed -
                  1000
              )
            ).fromNow()}`
          : '',
    };
  };

  const intervalFunc = () => {
    setState(getIntervalData());
  };

  const standardFunc = (init = false) => {
    const diff = props.item.data - Date.now();
    if (init) {
      if (diff < 0) {
        setState({
          msg: 'Reached',
        });
      } else {
        setState({
          msg: `Remaining: ${dayjs(props.item.data).toNow(true)}`,
        });
      }
    } else {
      if (diff < 0) {
        setState({
          msg: 'Reached',
        });
        clearInterval(interval.current);
      }
      setState({
        msg: `Remaining: ${dayjs(props.item.data).toNow(true)}`,
      });
    }

    return diff;
  };

  useEffect(() => {
    if (interval.current != null) {
      clearInterval(interval.current);
    }

    switch (props.item.type) {
      case 'standard':
        if (standardFunc(true) > 0) {
          interval.current = setInterval(() => {
            standardFunc();
          }, 1000);
        }
        break;
      case 'interval':
        intervalFunc();
        interval.current = setInterval(() => {
          intervalFunc();
        }, 1000);
        break;
    }

    props.onInterval(interval.current);
  }, [props.id]);

  if (props.item.type == 'standard') {
    const diff = props.item.data - Date.now();
    let data = {};

    if (diff < 0) {
      data = { msg: 'Reached' };
    } else {
      data = { msg: `Remaining: ${dayjs(props.item.data).toNow(true)}` };
    }

    [state, setState] = useState(data);
  } else {
    [state, setState] = useState(getIntervalData());
  }

  return (
    <Draggable
      key={`${props.nestedIndex}${props.index}`}
      draggableId={`${props.nestedIndex}${props.index}`}
      index={props.index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            backgroundColor: 'yellow',
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
            padding: 10,
            marginBottom: 10,
            ...provided.draggableProps.style,
          }}
        >
          <div
            style={{
              width: '60px',
              height: 'max-content',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row-reverse',
              position: 'absolute',
              padding: 8,
              top: 0,
              right: 0,
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                clearInterval(interval.current);
                props.onClose();
              }}
            >
              <CloseIcon
                className={
                  getTextColor(props.item.color || '#D1D1D1', true)
                    ? classes.buttonDark
                    : classes.buttonLight
                }
              />
            </IconButton>

            <IconButton size="small" onClick={props.onEdit}>
              <EditIcon
                className={
                  getTextColor(props.item.color || '#D1D1D1', true)
                    ? classes.buttonDark
                    : classes.buttonLight
                }
              />
            </IconButton>
          </div>

          <div
            style={{
              wordWrap: 'break-word',
              overflow: 'hidden',
              textAlign: 'center',
              width: '100%',
              fontSize: '20px',
              marginBottom: '15px',
              color: getTextColor(props.item.color || '#D1D1D1'),
            }}
          >
            {props.item.name}
          </div>
          <div
            style={{
              width: '100%',
              height: '24px',
              fontSize: '18px',
              textAlign: 'center',
              overflow: 'hidden',
              color: getTextColor(props.item.color || '#D1D1D1'),
            }}
          >
            {props.item.type == 'standard' ? state.msg : state.next}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: getTextColor(props.item.color || '#D1D1D1'),
              opacity: '0.5',
            }}
          >
            {props.item.type == 'standard' ? (
              dayjs(props.item.data)
                .tz('Etc/GMT-3')
                .format('YYYY-MM-DD hh:mm A')
            ) : (
              <div>
                {state.completed} <br />
                {state.last}
              </div>
            )}
          </div>
          <div
            style={{
              width: 'max-content',
              height: 'max-content',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row-reverse',
              position: 'absolute',
              padding: 8,
              top: 0,
              left: 0,
            }}
            {...provided.dragHandleProps}
          >
            <DragIcon size="small" />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Item;
