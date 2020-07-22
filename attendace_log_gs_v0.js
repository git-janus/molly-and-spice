function doGet(request) {
  return HtmlService
      .createTemplateFromFile('HTML')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('ATTENDANCE APP');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}

function writeToDb(data){
  var ss = SpreadsheetApp.openById('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');//<---change the sheet id here
  var ws = ss.getSheetByName('Attendance_Log');//<--- you may create a sheet with same name
  ws.appendRow(data);
}

function test_write(){
  writeToDb(['today','me','you','@']);
}