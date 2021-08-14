function doGet(request) {
  return HtmlService
      .createTemplateFromFile('Page')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('TP Cam View|Custom Skin');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}

function getMissionStatus(){
  var ss = SpreadsheetApp.openById('THIS IS WHERE THE SPREADSHEET ID OF THE DATABASE CREATED TO RECEIVE WEATHER IN FROM API');
  var ws = ss.getSheetByName('Weather_Data_Perseverance');
  var data = ws.getDataRange().getValues();
  var targetData = data[data.length - 1];
  var missionStatus = {SOL:targetData[2],
                      MINTEMPF:targetData[5].toFixed(2),MAXTEMPF:targetData[6].toFixed(2),
                      MINTEMPC:convertFTempToC(targetData[5]),MAXTEMPC:convertFTempToC(targetData[6]),
                      PRESSURE:targetData[7]};
  // Logger.log(missionStatus);
  return missionStatus;
}

function convertFTempToC(temp){
  var tC = (temp - 32) * 5/9;
  return tC.toFixed(2);
}