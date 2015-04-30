var tape = require('tape');
var summary = require('./index');

tape('summarise', function (t) {
  summary('//home.scenevr.hosting/home.xml', function (html) {
    t.ok(html.match(/<div/));
    t.ok(html.match(/<a href/));
    t.end();
  });
});
