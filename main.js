Webcam.attach( '#cam' );

function take_snapshot() {
  // take picture
  Webcam.snap( function(data_uri) {
    // show result
    document.getElementById('result').innerHTML = '<img src="'+data_uri+'"/>';
    // send result to ms emotion api
    $.ajax({
      url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
      type: 'POST',
      processData: false,
      beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",""); // fix later
              },
      data: makeBlob(data_uri)
    })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(err) {
      console.log(err);
    })
  });
}

// ty stackoverflow
// http://stackoverflow.com/questions/34047648/how-to-post-an-image-in-base64-encoding-via-ajax/34064793#34064793
function makeBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
