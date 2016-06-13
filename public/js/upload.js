function JSUploader() {
  this.allFiles = [];
  var baseClass = this;

  this.addFiles = function(files) {
    $.each(files, function(i, file) {
      var temp = { file: file, progressTotal: 0, progressDone: 0, valid: false };
      temp.valid = (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') && file.size / 1024 / 1024 < 2;
      baseClass.allFiles.unshift(temp);
    });
  };

  this.uploadFile = function(index) {
    var file = baseClass.allFiles[index];

    if (file.valid) {
      var data = new FormData();
      data.append('uploadFile', file.file);

      $.ajax({
        url: '/upload',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        /*success: function(response) {
          var message = file.element.find('td.message');
          if (response.status == 'ok') {
            message.html(response.text);
            file.element.find('button.uploadButton').remove();
          } else {
            message.html(response.errors);
          }
        },*/
        xhr: function() {
          var xhr = $.ajaxSettings.xhr();
          return xhr;
        }
      });
    }
  };

  this.uploadAllFiles = function() {
    $.each(baseClass.allFiles, function(i, file) {
      baseClass.uploadFile(i);
    });
  };
}

var uploader = new JSUploader();

$(document).ready(function() {
  $("#addFilesButton").click(function() {
    $("#uploadFiles").replaceWith($("#uploadFiles").clone(true));
    $("#uploadFiles").click();
  });

  $("#uploadAllFilesButton").click(function() {
    uploader.uploadAllFiles();
  });

  $("#uploadFiles").change(function() {
    var files = this.files;

    uploader.addFiles(files);
  });

});
