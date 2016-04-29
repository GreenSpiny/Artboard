var layerNum = 2;       // Number of next layer created
var layerObjects = [];  // Array of layers
var selectedLayerJS;    // Currently selected layer
var selectedLayerHTML;  // Currently selected layer

function layerObject(number,position) {
  this.id = "Layer_" + number.toString();
  this.name = this.id;
  this.opacity = 100;
  this.blendMode = "Normal";
  this.position = position;
  this.visible = true;
  this.locked = false;
}

function initializeLayers() {
  
  // Select layers
  $(".layer span").click(function() {
    $(".layer").each(function() {
      $(this).css("backgroundColor","#eee");
    });
    
    selectedLayerHTML = $(this).parent();
    selectedLayerHTML.css("backgroundColor","#ddd");
    
    getLayerJS();
    
    $("#layerName").val(selectedLayerJS.name);
    $("#layerOpacityNumber").val(selectedLayerJS.opacity);
    $("#layerOpacitySlider").val(selectedLayerJS.opacity);
    $("#layerBlend").val(selectedLayerJS.blendMode);
    
    $("#layerName").focus();
    
  });
  
  // Press layer buttons
  $(".layer button").click(function() {
    selectedLayerHTML = $(this).parent().parent();
    getLayerJS();
    var type = $(this).attr("num");
    
    // Toggle layer visibility
    if (type == "0") {
      selectedLayerJS.visible = !selectedLayerJS.visible;
      if (!selectedLayerJS.visible) {
        $(this).attr("id","Layer_Visibility_Off");
        $(this).attr("title","show layer");
      }
      else {
        $(this).attr("id","Layer_Visibility");
        $(this).attr("title","hide layer");
      }
    }
    
    // Toggle layer lock
    else if (type == "1") {
      selectedLayerJS.locked = !selectedLayerJS.locked;
      if (!selectedLayerJS.locked) {
        $(this).attr("id","Layer_Lock_Off");
        $(this).attr("title","lock layer");
      }
      else {
        $(this).attr("id","Layer_Lock");
        $(this).attr("title","unlock layer");
      }
    }
    
    // Create new layers
    else if (type == "2") {
      makeLayer("Layer_" + layerNum.toString());
    }
    
    // Duplicate layer
    else if (type == "3") {
    
    }
    
    // Delete layer
    else if (type == "4") {
    
    }
    
    // Move layer
    else if (type == "5") {
    
    }
    
    // Merge layer
    else if (type == "6") {
    
    }
    
    
    imageString = "resources/images/" + $(this).attr("id") + ".png";
    $(this).html("<img src=" + imageString + "></img>");
  });
  
  // Set button images
  $(".layer button").each(function() {
      imageString = "resources/images/" + $(this).attr("id") + ".png";
      $(this).html("<img src=" + imageString + "></img>");
  });

};

function getLayerJS() {
  for (var i = 0; i < layerObjects.length; i++) {
    var current = layerObjects[i];
    if (current.id == selectedLayerHTML.attr("id")) {
      selectedLayerJS = current;
      break;
    }
  }
};

function makeLayer(name) {
    var string = $("#layerList").html();
    string += '<div id="' + name + '" class="layer">'
    string += ' <div class="btn-group-vertical">'
    string += '   <button type="button" num="0" id="Layer_Visibility" class="micro btn btn-default visibility" data-toggle="tooltip" title="show / hide"></button>'
    string += '   <button type="button" num="1" id="Layer_Lock_Off" class="micro btn btn-default lock" data-toggle="tooltip" title="lock layer"></button>'
    string += ' </div>'
    string += ' <span class="nameArea">' + name + '</span>'
    string += ' <div class="btn-group">'
    string += '   <button type="button" num="2" id="Layer_New" class="nano btn btn-default new"    data-toggle="tooltip" title="new"></button>'
    string += '   <button type="button" num="3" id="Layer_Copy" class="nano btn btn-default copy"   data-toggle="tooltip" title="copy"></button>'
    string += '   <button type="button" num="4" id="Layer_Delete" class="nano btn btn-default delete" data-toggle="tooltip" title="delete"></button>'
    string += '   <button type="button" num="5" id="Layer_Move" class="nano btn btn-default move"   data-toggle="tooltip" title="move up"></button>'
    string += '   <button type="button" num="6" id="Layer_Merge" class="nano btn btn-default merge"  data-toggle="tooltip" title="merge down"></button>'
    string += ' </div>'
    string += '</div>';
    $("#layerList").html(string);
    layerObjects.push(new layerObject(layerNum,0));
    initializeLayers();
    layerNum ++;
}

function initializeLayerUI() {

  // Edit layer info
  $("#layerName").on("input",function() {
    selectedLayerJS.name = $(this).val();
    selectedLayerHTML.children(".nameArea").html($(this).val()); 
  });
  
  $("#layerBlend").on("change",function() {
    selectedLayerJS.blendMode = $(this).val();
  });
  
  // Opacity number / slider synchronization
  $("#layerOpacityNumber").on("input",function() {
    var value = $(this).val();
    if (value < 0 || (!$.isNumeric(value) && value != "")) {$(this).val(0);}
    else if (value > 100) {$(this).val(100);}
    $("#layerOpacitySlider").val(value);
    selectedLayerJS.opacity = value;
  });
  
  $("#layerOpacityNumber").on("change",function() {
    var value = $(this).val();
    if (value < 0 || !$.isNumeric(value) || value > 100) {
      $(this).val(0);
      $("#layerOpacitySlider").val(0);
      selectedLayerJS.opacity = 0;
    }
  });
  
  $("#layerOpacitySlider").on("input",function() {
    $("#layerOpacityNumber").val($(this).val());
    selectedLayerJS.opacity = $(this).val();
  });
  
}