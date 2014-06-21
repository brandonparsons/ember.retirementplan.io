export default function (color) {
  var seedColors = {
    purple: 'rgb(100,60,120)',
    yellow: 'rgb(250,165,30)',
    maroon: 'rgb(150,0,35)',
    red:    'rgb(235,35,35)',
    blue:   'rgb(30,120,190)',
    navy:   'rgb(25,75,120)',
    green:  'rgb(60,110,80)',
    gray:   'rgb(65,65,65)'
  };
  return seedColors[color];
}
