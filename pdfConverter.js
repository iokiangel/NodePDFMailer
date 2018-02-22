const fs = require('fs');
const pdf = require('html-pdf');
var html = fs.readFileSync('Invoice.html', 'utf8');
var options = {format: 'Landscape'};
convertHTML();

function convertHTML(){
  pdf.create(html, options).toFile('Invoice.pdf', function(err, res){
    if (err) console.log(err);
    else console.log('Conversion Success!!');
  })
}
