const fs = require('fs');
const core = require('@actions/core');

fs.readFile(`\\digital-will\\libs\\stacks\\contracts\\digitalWill\\log.txt`, 'utf16le', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  if (data.indexOf("FAILED")){
    core.setFailed("Test(s) Failed");
  }
});