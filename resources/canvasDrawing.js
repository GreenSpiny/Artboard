var pointsArray = [];              // Points stored for canvas drawing
var canvasPos = {top: 0, left: 0}; // Top left corner of the canvas

function initializeContext(ctx) {
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  
  $("#mainCanvas").mousemove(function(event) {
    if (canvasPressed) {
      pointsArray.push({x: event.clientX - canvasPos.left, y: event.clientY - canvasPos.top});
      
      ctx.beginPath();
      ctx.moveTo(pointsArray[0].x, pointsArray[0].y);
      for (var i = 1; i < pointsArray.length; i++) {
        ctx.lineTo(pointsArray[i].x, pointsArray[i].y);
      }
      ctx.stroke();
    }
  });
  
}