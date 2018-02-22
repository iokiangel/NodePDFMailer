/*
 * Developer: Joshua Lopes
 * Description: We must execute this
 *							from command line for us to get emails
 *							Ex. node executable htmlFileName invoiceTo invoiceNumber Emails
 *
 */
// P.S - Note I declare const so it saves us memory and therefore is more efficient
// Declaring our required modules
const emailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const fs = require('fs');
const pdf = require('html-pdf');
// Declaring variables, I know its all a little mess ~JLO
var emails = [];
var htmlChecker;
var htmlName;
var lineBreak = "\n";
var loggerFile = fs.createWriteStream('Log.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
var options = {format: 'Landscape'};
var myPdf = 'Invoice.pdf';
var invoiceNumber;
var invoiceTo;
var i = 0;
PopulateVariables();
WriteToLog("Invoice By: " + invoiceTo + "Invoice Number: " + invoiceNumber + "Date: " + GetDateTime());
ConvertToPdf();
CheckForFile();
/*
 *@fn: PopulateVariables()
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: Grabs parameters from command line and populates variables
 *
 *
 *
 *
 *
 */
function PopulateVariables(){
  //console.log('We are populating!');
	// We push the emails that are being sent with the execute from command line
	// The syntax for our command line: node executable htmlFileName invoiceTo invoiceNumber Emails
	process.argv.forEach(function (val, index, array){
		if(index === 2) {
      htmlChecker = val;
      htmlName = fs.readFileSync(val, 'utf8');
      //console.log(htmlName);
		}
    else if(index === 3){
      invoiceTo = val;
    }
    else if(index === 4){
      invoiceNumber = val;
    }
		else if (index > 4) {
		 emails.push(val);
		}
	});
}
/*
 *@fn: ConvertToPdf()
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: We grab our invoice.html and convert it to a pdf
 *              we are using PhantomJS!
 *
 *
 *
 *
 */
function ConvertToPdf(){
  pdf.create(htmlName, options).toFile('Invoice.pdf', function(err, res){
    if (err) WriteToLog(err);
    else WriteToLog('Conversion Success!!');
  })
}
/*
 *@fn: Mail()
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: Attaches the pdf file to an email which is then sent
 *
 *
 *
 *
 *
 */
function Mail(){

	var dateTime = GetDateTime();

  var html = invoiceTo + ",";
	html += "<p>Attached is Invoice " + invoiceNumber + "</p>";
	html += "Sent By: removed for privacy at " + dateTime;
  html += "<p>This is an automated email using RHx Systems, Do not reply to this email.</p>";

	var emailOptions = {
		from: "RHx Systems <invoices@rhxsytems.com>"
		      , to:emails
		      , subject: 'Invoice'
		      , html: html
					, attachments: [{path: myPdf}] //This will be where we attach the file

	};

		var smtpOptions = {
			host: 'removed for privacy',
			port: 587,
			secure: false,
			ignoreTLS: true,
			auth: {
				user: 'removed for privacy' ,
				pass: 'removed for privacy'
			}
		};

	var transporter = emailer.createTransport(smtpTransport(smtpOptions));

	transporter.sendMail(emailOptions, function(error, response){

		if(!error){

			WriteToLog('Success Sending Email!');
      DeleteFile();
		}

		else {
			WriteToLog('error + ' + error);
      DeleteFile();
		}

	})
}
/*
 *@fn:
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: basic datetime function
 *
 *
 *
 *
 */
function GetDateTime() {

  var dateTime = new Date();

	var month, date, year, hours, min, sec, fullDate, fullTime;

	month = (dateTime.getMonth() + 1) + '\\';
	date = dateTime.getDate() + '\\';
	year = dateTime.getFullYear() + ' ';

	hours = dateTime.getHours() + ':';
	mins = dateTime.getMinutes() + ':';
	sec = dateTime.getSeconds();

	fullDate = month + date + year;

	fullTime = hours + mins + sec;

	return fullDate + fullTime;

}
/*
 *@fn: WriteToLog()
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: We write all our success or errors to our log file
 *
 *
 *
 *
 *
 */
function WriteToLog(logLine){
  loggerFile.write(lineBreak + logLine);
}
/*
 *@fn: EndWriting()
 *@developer:
 *@date: 2/8/2017
 *@description: We need to close our Writer so we call this at the end
 *
 *
 *
 *
 *
 */
function EndWriting(){
  loggerFile.end();
}
/*
 *@fn: CheckForFile()
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: We check if our file exists and we wait for awhile until it does
 *
 *
 *
 *
 *
 */
function CheckForFile(){
  while(!fs.exists(myPdf) && i < 1000000){
  		i++;
    if(fs.existsSync(myPdf) && fs.existsSync(htmlChecker)){
      Mail();
      i = 1000001;
    }
  }
}
/*
 *@fn: DeleteFile()
 *@developer: Joshua Lopes
 *@date: 2/8/2017
 *@description: We delete our pdf and html so we dont take up space
 *              and so we don't ever send it again.
 *
 *
 *
 *
 */
function DeleteFile(){
  fs.unlinkSync(myPdf);
  fs.unlinkSync(htmlChecker);
  WriteToLog("Deleted: " + myPdf + " and " + htmlChecker);
}
