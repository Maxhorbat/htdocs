var onePaths = $('#one g .st0');
var sixPaths = $("#six g .st0");
var oneTL = new TimelineMax({repeat:-1, ease: Power2.easeOut});
var sixTL = new TimelineMax({repeat:-1, ease: Power2.easeOut});
var gold = "#f8d31f";
var bg = "transparent";

// To Gold
onePaths.each(function() {
  oneTL.to($(this), 0.3, {fill:gold}, '-=0.25');
});
sixPaths.each(function() {
  sixTL.to($(this), 0.06, {fill:gold}, '-=0.037');
});
oneTL.to('',0.75, {fill:bg});
sixTL.to('',0.75, {fill:gold});

// To Empty
onePaths.each(function() {
  oneTL.to($(this), 0.3, {fill:bg}, '-=0.25');
});
sixPaths.each(function() {
  sixTL.to($(this), 0.06, {fill:bg}, '-=0.037');
});
oneTL.to('',0.15, {fill:bg});
sixTL.to('',0.15, {fill:gold});
