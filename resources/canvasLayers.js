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
}

function initializeLayers() {
  
  // Select layers
  $(".layer span").click(function() {
    $(".layer").each(function() {
      $(this).css("backgroundColor","#eee");
    });
    
    selectedLayerHTML = $(this).parent();
    selectedLayerHTML.css("backgroundColor","#ddd");
    
    for (var i = 0; i < layerObjects.length; i++) {
      var current = layerObjects[i];
      if (current.id == selectedLayerHTML.attr("id")) {
        selectedLayerJS = current;
        break;
      }
    }
    $("#layerName").val(selectedLayerJS.name);
    $("#layerOpacityNumber").val(selectedLayerJS.opacity);
    $("#layerOpacitySlider").val(selectedLayerJS.opacity);
    $("#layerBlend").val(selectedLayerJS.blendMode);
    
  });
  
  // Create new layers
  $(".layer .new").click(function() {
    var string = $("#layerList").html();
    string += '<div id="Layer_' + layerNum.toString() + '" class="layer">'
    string += ' <div class="btn-group-vertical">'
    string += '   <button type="button" class="micro btn btn-default visibility" data-toggle="tooltip" title="show / hide"></button>'
    string += '   <button type="button" class="micro btn btn-default lock" data-toggle="tooltip" title="lock layer"></button>'
    string += ' </div>'
    string += ' <span class="nameArea">Layer_'+ layerNum.toString() + '</span>'
    string += ' <div class="btn-group">'
    string += '   <button type="button" class="nano btn btn-default new"    data-toggle="tooltip" title="new"></button>'
    string += '   <button type="button" class="nano btn btn-default copy"   data-toggle="tooltip" title="copy"></button>'
    string += '   <button type="button" class="nano btn btn-default delete" data-toggle="tooltip" title="delete"></button>'
    string += '   <button type="button" class="nano btn btn-default move"   data-toggle="tooltip" title="move up"></button>'
    string += '   <button type="button" class="nano btn btn-default merge"  data-toggle="tooltip" title="merge down"></button>'
    string += ' </div>'
    string += '</div>';
    $("#layerList").html(string);
    layerObjects.push(new layerObject(layerNum,0));
    initializeLayers();
    layerNum ++;
  });

};

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