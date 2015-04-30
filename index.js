var WebSocket = require('ws');
var htmlparser = require('htmlparser2');

var slow = function (url) {
  console.log('Inspecting ' + url);
  
  var ws = new WebSocket(url, 'scenevr');

  var tagCount = 0;

  var parser = new htmlparser.Parser({
    onopentag: function (name, attribs) {
      tagCount++;
    }
  }, { xmlMode: true });

  var timeout = null;

  var finish = function () {
    clearTimeout(timeout);
    ws.close();

    var msg = 'There are ' + tagCount + ' elements in the scene. ';

    if (tagCount < 100) {
      console.log(msg + 'grade A');
    } else if (tagCount < 250) {
      console.log(msg + 'grade B');
    } else {
      console.log(msg + 'grade C');
    }
  };

  ws.on('open', function open () {
    // Cancel connection after 5 seconds

    timeout = setTimeout(function () {
      console.log('Timed out after 5 seconds trying to recieve initial packet. Is the server down or really slow?');
      process.exit();
    }, 5000);
  });

  ws.on('message', function (data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.

    if (data.match(/<spawn/)) {
      parser.write(data);
      parser.end();
      finish();
    }
  });
};

slow(process.argv[2]);