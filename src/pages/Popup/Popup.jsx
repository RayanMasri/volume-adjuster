import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';

const useStyles = makeStyles({
  root: {
    height: 300,
    width: 'max-content',
    backgroundColor: 'black',
  },
  icon: {
    color: '#2D7CA3',
  },
  night_icon: {
    color: '#F19A37',
  },
  slider: {
    color: '#2D7CA3',
  },
  night_slider: {
    color: '#F19A37',
  },
});

export default function Popup() {
  const [state, setState] = useState({
    audio: {
      status: true,
      value: 100,
    },
    brightness: {
      status: false, // is night mode ?
      value: 100,
    },
  });
  const classes = useStyles();
  let tab = useRef(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([_tab]) => {
      tab.current = _tab;
      chrome.runtime.sendMessage(
        { action: 'get-gain', id: tab.current.id },
        (audio) => {
          chrome.runtime.sendMessage(
            { action: 'get-brightness', id: tab.current.id },
            (brightness) => {
              setState({
                audio: audio,
                brightness: brightness,
              });
            }
          );
        }
      );
    });
  }, []);

  const update = (data, event) => {
    chrome.runtime.sendMessage({
      action: `${event}-change`,
      id: tab.current.id,
      data: data,
    });
  };

  const toggle = (name) => {
    let data = {
      status: !state[name].status,
      value: state[name].value,
    };

    setState({
      ...state,
      [name]: data,
    });

    update(data, name);
  };

  const onChange = (event, name, value) => {
    if (event != null && event.type == 'mousedown') {
      onStart(name);
    }

    let data = {
      status: state[name].status,
      value: value,
    };

    setState({
      ...state,
      [name]: data,
    });

    update(data, name);
  };

  const onStart = (name) => {
    console.log(`Pressed ${name}`);
  };

  const onEnd = (name) => {
    console.log(`Released ${name}`);
  };

  const reset = () => {
    let object = {
      audio: {
        status: true,
        value: 100,
      },
      brightness: {
        status: false,
        value: 100,
      },
    };

    setState(object);

    Object.entries(object).map(([key, value]) => {
      update(value, key);
    });
  };

  let icon = state.brightness.status ? classes.night_icon : classes.icon;
  let slider = state.brightness.status ? classes.night_slider : classes.slider;

  return (
    <div
      style={{
        backgroundColor: '#593F62',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          backgroundColor: '#593F62',
          display: 'flex',
          justifyContent: 'row',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            // #593F62
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 5,
          }}
        >
          <div
            style={{
              height: 300,
              width: 'max-content',
              marginBottom: 15,
              marginTop: 55,
            }}
          >
            <Slider
              className={slider}
              orientation="vertical"
              aria-labelledby="vertical-slider"
              valueLabelDisplay="auto"
              onChange={(event, value) => onChange(event, 'brightness', value)}
              value={state.brightness.value}
              max={200}
              min={0}
            />
          </div>

          <IconButton onClick={() => toggle('brightness')}>
            {state.brightness.value > 0 ? (
              <BrightnessHighIcon size="medium" className={icon} />
            ) : (
              <BrightnessLowIcon size="medium" className={icon} />
            )}
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 5,
          }}
        >
          <div
            style={{
              height: 300,
              width: 'max-content',
              marginBottom: 15,
              marginTop: 55,
            }}
          >
            <Slider
              className={classes.slider}
              disabled={!state.audio.status}
              orientation="vertical"
              aria-labelledby="vertical-slider"
              valueLabelDisplay="auto"
              onChange={(event, value) => onChange(event, 'audio', value)}
              onChangeCommitted={(_) => onEnd('audio')}
              value={state.audio.value}
              max={1000}
              min={0}
            />
          </div>

          <IconButton onClick={() => toggle('audio')}>
            {state.audio.status ? (
              state.audio.value <= 500 && state.audio.value > 0 ? (
                <VolumeDownIcon size="medium" className={classes.icon} />
              ) : state.audio.value < 1 ? (
                <VolumeMuteIcon size="medium" className={classes.icon} />
              ) : (
                <VolumeUpIcon size="medium" className={classes.icon} />
              )
            ) : (
              <VolumeOffIcon size="medium" className={classes.icon} />
            )}
          </IconButton>
        </div>
      </div>
      <Button onClick={reset}>Reset to default</Button>
    </div>
  );
}
