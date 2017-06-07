var test = require("ava").test;
var binCheck = require("bin-check");

test.cb("check bin", function(t) {
  t.plan(1);

  binCheck("./wunderline.js").then(works => {
    if (works) {
      t.pass();
    } else {
      t.fail();
    }
    t.end();
  });
});
