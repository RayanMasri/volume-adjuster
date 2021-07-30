import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const hexToRGB = (hex) => {
  return (hex = hex.replace('#', ''))
    .match(new RegExp('(.{' + hex.length / 3 + '})', 'g'))
    .map(function (l) {
      return parseInt(hex.length % 2 ? l + l : l, 16);
    })
    .join(',');
};

const getTextColor = (backgroundColor, boolean = false) => {
  let rgb = hexToRGB(backgroundColor).split(',');
  let exp = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 > 186;

  return boolean ? exp : exp ? '#000000' : '#ffffff';
};

const format = (date) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return dayjs(new Date(date)).tz('Etc/GMT-3').format('YYYY-MM-DD hh:mm A');
};

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export { uuid, format, getTextColor };
