const fs = require('fs');
const core = require('@actions/core');

// fs.readFile(`log.txt`, 'utf16le', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
//   if (data.indexOf("FAILED") != -1){
//     core.setFailed("Test(s) Failed");
//   }
// });

process.stdin.on("data", data => {
  data = data.toString().toUpperCase()
  process.stdout.write(data + "\n")
})