const fs = require('fs');
const core = require('@actions/core');

fs.readFile(`digital-will\libs\stacks\contracts\digitalWill\\log.txt`, 'utf16le', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
  if (data.indexOf("FAILED") != -1){
    core.setFailed("Test(s) Failed");
  }
});