var ss = SpreadsheetApp.getActive();
var wsMain = ss.getSheetByName('Main');
var wsMainMirror = ss.getSheetByName('Main_Mirror');
function onEdit(e){
  var rng = e.range;
  var wsName = rng.getSheet().getName();
  var wsCol = rng.getColumn();
  var OLDVALUE;
  var NEWVALUE;
  if(wsName === 'Main'){
    if(rng.getValue() != ""){
      OLDVALUE = e.oldValue;
    }else{
      OLDVALUE = wsMainMirror.getRange(rng.getA1Notation()).getValue();
    }
    NEWVALUE = rng.getValue();
    wsMainMirror.getRange(rng.getA1Notation()).setValue(NEWVALUE);
    Logger.log("NEWVALUE : " + NEWVALUE);
    Logger.log("OLDVALUE : " + OLDVALUE);
  } 
}