
$(document).ready(function(){

  
  // Call to colorbox for iframe pre-registro
  $( ".pre" ).colorbox({
    iframe:true,
    innerWidth: "75%",
    innerHeight: "75%", 
  });

  // Call to colorbox for iframe contacto
  $( ".contacto" ).colorbox({
    iframe:true,
    innerWidth: "40%",
    innerHeight: "40%", 
  });    

  //RWD colorbox
  var x = $('mydiv').width();
  var y = $('mydiv').height();
  parent.$.colorbox.resize({width:x, height:y});

});
