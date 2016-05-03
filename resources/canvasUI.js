var TC = tinycolor("#000");

var inputReady = true;      // True if the color picking tools are ready for new input
var hueChanged = true;      // True if the hue has been changed and the color picker must be regenerated
var rOffset = 16;           // Position offset of the canvas resizer
var mouseOnCanvas = false;  // True if the mouse is over the canvas

var pickerPressed = false;  // True if the color picker has been pressed
var canvasPressed = false;  // True if the drawing canvas has been pressed
var oldMousePos = [0,0];    // Previous mouse position

var pickerPos = [0,0];  // Coordinates on picker in percent (%)
var pickerWidth = 84;   // Width of the picker canvas

var colorCanvas;
var colorContext;

var mainCanvas;
var mainContext;

tempHue = 0;        // Store hue correctly
tempSaturation = 0; // Store saturation correctly
tempValue = 0;      // Store value correctly
cursorString = "";  // String signifying cursor image

// -------- Document Ready -------- //

// Close browser window
window.onbeforeunload = function() {
  return "If all instances of this drawing are closed, unsaved changes will be lost.";
};

$(document).ready(function(){
  
  colorCanvas = document.getElementById("colorCanvas");
  colorContext = colorCanvas.getContext("2d");
  adjustPicker();
  
  mainCanvas = document.getElementById("mainCanvas");
  mainContext = mainCanvas.getContext("2d");
  initializeContext(mainContext);
  
  // Monitor mouse state
  $("#colorPicker canvas").mousedown(function(event){
    pickerPressed = true;
    chooseColor(event);
  });
  
  $("#mainCanvas").mousedown(function(event){
    canvasPressed = true;
    canvasPos = $("#mainCanvas").offset();
    pointsArray.push({x: event.clientX - canvasPos.left, y: event.clientY - canvasPos.top});
  });
  
  $(".handle").mousedown(function(event){
    $(this).attr("pressed","1");
    oldMousePos = [event.clientX, event.clientY];
  });

  $(document).mouseup(function(){
    pickerPressed = false;
    canvasPressed = false;
    pointsArray = [];
     $(".handle").each(function() {
      $(this).attr("pressed","0");
     });
  });
  
  // Select primary color
  $(".colorBox").click(function() {
    $(".colorBox").each(function() {
      $(this).css("zIndex",1);
    });
    $(this).css("zIndex",2);
    hueChanged = true;
    setValuesByColor($(this).attr("id"));
  });
  
  // Adjust hue
  $("#hueSlider").on("input",function(){
    hueChanged = true;
  });
  
  // Adjust colors (RGB sliders)
  $("#RGBsliders .rangeInput").on("input",function(){
    if (inputReady) {
      TC = tinycolor("rgb " + $("#redSlider").val().toString() + ", " + $("#greenSlider").val().toString() + ", " + $("#blueSlider").val().toString() + ")");
      hueChanged = true;
      setValuesByInput("rgb");
    }
 });
 
  // Adjust colors (RGB numbers)
  $("#RGBsliders .numberInput").on("input",function(){
    if (inputReady) {
      TC = tinycolor("rgb " + $("#redNumber").val().toString() + ", " + $("#greenNumber").val().toString() + ", " + $("#blueNumber").val().toString() + ")");
      hueChanged = true;
      setValuesByInput("rgb");
    }
  });
    
  // Adjust colors (HSV sliders)
  $("#HSVsliders .rangeInput").on("input",function(){
    if (inputReady) {
      TC = tinycolor("hsv " + $("#hueSlider").val().toString() + ", " + ($("#saturationSlider").val()/100.0).toString() + ", " + ($("#valueSlider").val()/100.0).toString() + ")");
      tempHue = $("#hueSlider").val();
      tempSaturation = $("#saturationSlider").val();
      tempValue = $("#valueSlider").val();
      setValuesByInput("hsv");
    }
 });
 
  // Adjust colors (HSV numbers)
  $("#HSVsliders .numberInput").on("input",function(){
    if (inputReady) {
      TC = tinycolor("hsv " + $("#hueNumber").val().toString() + ", " + $("#saturationNumber").val().toString() + ", " + $("#valueNumber").val().toString() + ")");
      tempHue = $("#hueNumber").val();
      tempSaturation = $("#saturationNumber").val();
      tempValue = $("#valueSlider").val();
      setValuesByInput("hsv");
    }
 });
 
  // Click side buttons
  $("#sideBar .btn").click(function(){
    $("#sideBar .btn").each(function() {
      $(this).removeClass("active");
    });
    $(this).addClass("active");
    $(this).tooltip("hide");
  });
  
  // Color picker functionality
  $("#colorPicker canvas").mousemove(function(event){
    chooseColor(event);
  });
  
  // Drag toolbars
  $(document).mousemove(function(event){
    
    var newMousePos = [event.clientX, event.clientY];
    var distance = [newMousePos[0] - oldMousePos[0], newMousePos[1] - oldMousePos[1]];
    mouseOnCanvas = canvasMouse(newMousePos[0],newMousePos[1]);
    
    if ($("#sideBarHandle").attr("pressed") == "1") {
      $("#sideBar").animate({ 
        "left": "+=" + distance[0],
        "top": "+=" + distance[1]
      },0);
    }
    
    else if ($("#layersBarHandle").attr("pressed") == "1") {
      $("#layersBar").animate({ 
        "right": "-=" + distance[0],
        "top": "+=" + distance[1]
      },0);
    }
    
    else if ($("#canvasResize").attr("pressed") == "1" && !mouseOnCanvas) {
    
      $("#canvasResize").animate({ 
        "left": "+=" + distance[0],
        "top": "+=" + distance[1]
      },0);
      
      $("#canvasWidth").val(parseInt($("#canvasWidth").val()) + distance[0]*2);
      $("#canvasHeight").val(parseInt($("#canvasHeight").val()) + distance[1]);
      
      $("#mainCanvas").css("width",$("#canvasWidth").val());
      $("#mainCanvas").css("height",$("#canvasHeight").val());
    }
    
    oldMousePos = newMousePos;
  });
  
  // Resize canvas  
  $("#canvasWidth").on("change",function() {
    if ($(this).val() < 1) {
      $(this).val(1);
    }
    else if ($(this).val() > parseInt($("#mainCanvas").attr("width"))) {
      $(this).val($("#mainCanvas").attr("width"));
    }
    $("#mainCanvas").css("width",$(this).val());
    setResize();
  });
  
  $("#canvasHeight").on("change",function() {
    if ($(this).val() < 1) {
      $(this).val(1);
    }
    else if ($(this).val() > parseInt($("#mainCanvas").attr("height"))) {
      $(this).val($("#mainCanvas").attr("height"));
    }
    $("#mainCanvas").css("height",$(this).val());
    setResize();
  });
  
  setResize();
  
  // Update picker color as needed
  adjustPicker();
  $("#topBar input").on("change",function(){
  if (hueChanged) {
    adjustPicker();
    hueChanged = false;
  }
  });
  
  // Set tool button images
  $("#sideBar .btn").each(function(){
    var image = $(this).attr("id");
    if (image != null) {
      imageString = "resources/images/" + image + ".png";
      $(this).html("<img src=" + imageString + "></img>");
    }
    $(this).tooltip({delay: {show: 500, hide: 50}}); 
  });
  
  // Set tool button click functionality
  $("#sideBar .btn").click(function(){
    var image = $(this).attr("id");
    var xOffset = $(this).attr("x");
    var yOffset = $(this).attr("y");
    if ($(this).attr("custom") != "") {
      cursorString = $(this).attr("custom");
    }
    else {
      cursorString = "url(resources/images/" + image + "_cursor.png) " + xOffset + " " + yOffset + ", auto";
    }
  });
  
  // Set cursor image
  $("#mainCanvas").mouseenter(function(){
    if (cursorString != "") {
      $(this).css("cursor",cursorString);
    }
  });
  
  $("#canvasResize").mousemove(function(){
    if (mouseOnCanvas) {
       $(this).css("cursor",cursorString);
    }
    else {
       $(this).css("cursor","pointer");
    }
  });
  
  // Set initial layer values
  $(".layer").css("backgroundColor","#ddd");
  layerObjects.push(new layerObject(1,0));
  selectedLayerJS = layerObjects[0];
  selectedLayerHTML = $("#" + selectedLayerJS.id);
  $("#layerName").val(selectedLayerJS.id);
  
  // Run layer formatting code
  initializeLayerUI();
  initializeLayers();
  
});

// -------------------------------- //

// Mouse on canvas - hard check
function canvasMouse(x,y) {
  return (
    x >= $("#mainCanvas").position().left &&
    x < $("#mainCanvas").position().left + parseInt($("#canvasWidth").val()) &&
    y >= $("#mainCanvas").position().top &&
    y < $("#mainCanvas").position().top + parseInt($("#canvasHeight").val())
    );
}

// Reset canvas resize tool
function setResize() {
  $("#canvasResize").css("left",$("#mainCanvas").position().left + parseInt($("#canvasWidth").val()) - rOffset);
  $("#canvasResize").css("top",$("#mainCanvas").position().top + parseInt($("#canvasHeight").val()) - rOffset);
}

// Color picker selection
function chooseColor(event) {
  if (pickerPressed) {
    var xPos = event.clientX - $("#colorPicker canvas").offset().left;
    var yPos = event.clientY - $("#colorPicker canvas").offset().top;
    pickerPos = [xPos / pickerWidth, 1 - (yPos / pickerWidth)];
    TC = tinycolor("hsv " + $("#hueNumber").val().toString() + ", " + pickerPos[0].toString() + ", " + pickerPos[1].toString() + ")");
    setValuesByInput("picker");
  }
}

// Set slider and primary / secondary colors based on the TC object
function setValuesByInput(method) {
  inputReady = false;
  
  var rgb = TC.toRgb();
  $("#redSlider").val(rgb.r); 
  $("#greenSlider").val(rgb.g);
  $("#blueSlider").val(rgb.b);
  $("#redNumber").val(rgb.r);
  $("#greenNumber").val(rgb.g);
  $("#blueNumber").val(rgb.b);


  var hsv = TC.toHsv();

  if (method == "hsv") {
    $("#hueSlider").val(tempHue); 
    $("#saturationSlider").val(tempSaturation);
    $("#valueSlider").val(tempValue);
    $("#hueNumber").val(tempHue);
    $("#saturationNumber").val(tempSaturation);
    $("#valueNumber").val(tempValue);
  }
  
  else {
    $("#hueSlider").val(Math.round(hsv.h)); 
    $("#saturationSlider").val(Math.round(hsv.s * 100.0));
    $("#valueSlider").val(Math.round(hsv.v * 100.0));
    $("#hueNumber").val(Math.round(hsv.h));
    $("#saturationNumber").val(Math.round(hsv.s * 100.0));
    $("#valueNumber").val(Math.round(hsv.v * 100.0));
  }
  
  inputReady = true;
  
  $(".colorBox").each(function() {
    if ($(this).css("zIndex") == 2) {
      $(this).css("backgroundColor",TC.toRgbString());
    }
  });
}

// Set slider values by an existing primary or secondary color
function setValuesByColor(id) {
  TC = tinycolor($("#" + id).css("background-color"));
  setValuesByInput();
}

// Set values of color picker
function adjustPicker() {
  hueChanged = false;
  var imgData = colorContext.createImageData(pickerWidth,pickerWidth);
  for (var i = 0; i < imgData.data.length; i += 4) {
    xPos = ((i/4.0) % pickerWidth) / pickerWidth;
    yPos = 1.0 - ((Math.floor((i/4.0) / pickerWidth)) / pickerWidth);
    tempColor = tinycolor("hsv " + $("#hueNumber").val().toString() + " " + xPos.toString() + " " + yPos.toString()).toRgb();
  
    imgData.data[i] = tempColor.r;
    imgData.data[i+1] = tempColor.g;
    imgData.data[i+2] = tempColor.b;
    imgData.data[i+3] = 255;
  }
  colorContext.putImageData(imgData,0,0);
}










