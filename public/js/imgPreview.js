/*function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $('#prev').attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  $("#image").change(function() {
    readURL(this);
  });*/

//upload image
/* function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}*/
/*$(document).ready(function() {
  $('#uploadForm').submit(function() {
     $("#status").empty().text("File is uploading...");
     $(this).ajaxSubmit({
         error: function(xhr) {
       status('Error: ' + xhr.status);
         },
         success: function(response) {
     console.log(response)
         $("#status").empty().text(response);
         }
 });
 return false;
 });    
});*/

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#prev')
                .attr('src', e.target.result)

            // .width(150)
            // .height(200);
        };

        reader.readAsDataURL(input.files[0]);

        //ajax post here
        $.ajax({
            url: '/admin/details',
            method: 'POST',
            data: new FormData($('#form')[0])
        }).done(function(data) {

        }).fail(function(jqXHR, textStatus, errorThrown) {

        });
    }
}


function readFloorURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#floorprev')
                .attr('src', e.target.result)

            // .width(150)
            // .height(200);
        };

        reader.readAsDataURL(input.files[0]);

        //ajax post here
        $.ajax({
            url: '/admin/details',
            method: 'POST',
            data: new FormData($('#form')[0])
        }).done(function(data) {

        }).fail(function(jqXHR, textStatus, errorThrown) {

        });
    }
}