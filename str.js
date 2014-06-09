/*

Switched from reading from stdin to reading line by line.

*/

//readline = require('readline');

sys = require("sys");
fs = require("fs");
reader = require("./read.js");

//stores all working data
var genome = {};
var reads = {};

//tag size
var HEAD = 5;
var TAIL = 2;

function readReads (){
  // old implementation takes 15 mins to read from stdin
  // var stdinput = "";
  // var rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  //   terminal: false
  // });

  // rl.on('line', function (line) {
  //   stdinput += line;
  // });
  // rl.close(function() {
  //   processReads(stdinput);
  // })

  //read file line by line for faster buffering
  var genomeReader = new reader.FileLineReader("reads.txt", 10);
  while (genomeReader.hasNextLine()) {
    processReads(genomeReader.nextLine());
  }
  //console.log(reads);
}

function readGenome() {
  //read entire file for easier processing
  // console.log("reading");
  // fs.readFile('genome.txt', 'utf8', function (err,data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   //since genome cannot be processed line by line, need to join into one long string
  //   var file = data.replace('\n', '');
  //   processGenome(file);
  // });

  var genomeReader = new reader.FileLineReader("genome.txt", 10);
  while (genomeReader.hasNextLine()) {
    processGenome(genomeReader.nextLine());
  }

  //console.log(genome);
}

function processReads (line) {
  //check for repeats of 3-5 chars
  for (var len = 2; len <= 5; len++) {
    var count = 0;
    //loop through the entire line, skip the first and last few because needed for tags
    for (var i = HEAD-1; i < line.length-len-1-TAIL; i++) {
      if (line[i] == line[i+len]) {
        count++;
      }
      if (count == len) {
        //move to the second repeat
        var pos = i+1;
        //already two repeats
        var repeats = 2;
        var str = line.substr(pos, len);
        //pass the second repeat and count additional repeats
        for (pos += len; pos < line.length-len-1-TAIL; pos += len) {
          if (line.substr(pos, len) === str) {
            repeats++;
          } else {
            break;
          }
        }
        if (repeats >= 3) {
          //store repeats HEAD, STR, TAIL 
          var tag = line.substr(i-len+1-HEAD, HEAD) + str + line.substr(pos, TAIL);
          //create new key if not created
          if (reads[tag] == null) {
            reads[tag] = [];
          }
          //append repeat number to list
          reads[tag].push(repeats);
          //avoid duplicate smaller STRs
          return;
        }
      }
    }
  }
}

function processGenome (line) {
  //check for repeats of 3-5 chars
  for (var len = 2; len <= 5; len++) {
    var count = 0;
    //loop through the entire line, skip the first and last few because needed for tags
    for (var i = HEAD-1; i < line.length-len-1-TAIL; i++) {
      if (line[i] == line[i+len]) {
        count++;
      }
      if (count == len) {
        //move to the second repeat
        var pos = i+1;
        //already two repeats
        var repeats = 2;
        var str = line.substr(pos, len);
        //console.log(str);
        //pass the second repeat and count additional repeats
        for (pos += len; pos < line.length-len-1-TAIL; pos += len) {
          if (line.substr(pos, len) === str) {
            repeats++;
          } else {
            break;
          }
        }
        if (repeats >= 3) {
          //store repeats HEAD, STR, TAIL 
          var tag = line.substr(i-len+1-HEAD, HEAD) + str + line.substr(pos, TAIL);
          //create new key if not created
          if (genome[tag] == null) {
            genome[tag] = [];
          }
          //append repeat number to list
          genome[tag].push(repeats);
          //avoid duplicate smaller STRs, skip to next
          i = pos;
        }
      }
    }
  }
}

function matchReadsToGenome() {
  var genomeDuplicates = 0;
  var totalGenome = 0;
  for (var key in genome) {
    totalGenome ++;
    if (genome[key].length >= 2) {
      genomeDuplicates++;
    }
  }
  console.log("Genome Duplicates: " + genomeDuplicates + "/" + totalGenome);

  //match up keys
  var unmatched = 0;
  for (var key in reads) {
    if (genome[key] != null) {
      console.log("" + key.substr(HEAD, key.length-HEAD-TAIL) + ", " + reads[key] + ", " + genome[key]);
    } else {
      unmatched ++;
    }
  }
}

(function() {
  readReads();
  readGenome();
  matchReadsToGenome();
})();