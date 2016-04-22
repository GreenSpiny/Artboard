var layerNum = 2;

function initializeLayers() {
  
  // Select layers
  $(".layer span").click(function() {
    $(".layer span").each(function() {
      $(this).parent().css("backgroundColor","#eee");
    });
    $(this).parent().css("backgroundColor","#ddd");
  });
  
  // Create new layers
  $(".layer .new").click(function() {
    var string = $("#layerList").html();
    string += '<div id="layer"' + layerNum.toString() + ' class="layer">'
    string += ' <div class="btn-group-vertical">'
    string += '   <button type="button" class="micro btn btn-default visibility" data-toggle="tooltip" title="show / hide"></button>'
    string += '   <button type="button" class="micro btn btn-default lock" data-toggle="tooltip" title="lock layer"></button>'
    string += ' </div>'
    string += ' <span class="nameArea">Layer '+ layerNum.toString() + '</span>'
    string += ' <div class="btn-group">'
    string += '   <button type="button" class="nano btn btn-default new"    data-toggle="tooltip" title="new"></button>'
    string += '   <button type="button" class="nano btn btn-default copy"   data-toggle="tooltip" title="copy"></button>'
    string += '   <button type="button" class="nano btn btn-default delete" data-toggle="tooltip" title="delete"></button>'
    string += '   <button type="button" class="nano btn btn-default move"   data-toggle="tooltip" title="move up"></button>'
    string += '   <button type="button" class="nano btn btn-default merge"  data-toggle="tooltip" title="merge down"></button>'
    string += ' </div>'
    string += '</div>';
    $("#layerList").html(string);
    initializeLayers();
    layerNum ++;
  });

  // Opacity number / slider synchronization
  $("#layerOpacityNumber").on("input",function() {
    var value = $(this).val();
    if (value < 0 || (!$.isNumeric(value) && value != "")) {$(this).val(0);}
    else if (value > 100) {$(this).val(100);}
    $("#layerOpacitySlider").val(value);
  });
  
  $("#layerOpacityNumber").on("change",function() {
    var value = $(this).val();
    if (value < 0 || !$.isNumeric(value) || value > 100) {
    $(this).val(0);
    $("#layerOpacitySlider").val(0);
    }
  });
  
  $("#layerOpacitySlider").on("input",function() {
    $("#layerOpacityNumber").val($(this).val());
  });

};