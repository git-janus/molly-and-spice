function doGet(request) {
  return HtmlService
      .createTemplateFromFile('HTML')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('SUNNYSIDEUP');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}

function LogInAccepted(username,password){
  var ss = SpreadsheetApp.openById("1U7sWHbli6npx4RyuwYpoNa1kZS_rzpY8AsDVVYB3av8");//<--SPREADSHEET ID
  var ws = ss.getSheetByName("Users");
  var ws_log = ss.getSheetByName("Login History");
  var tbl = ws.getDataRange().getValues();
  var user = ArrayLib.filterByValue(tbl, 4, username);//<--INSTALL ArrayLib library. app id is MOHgh9lncF2UxY-NXF58v3eVJ5jnXUK_T
  if(user.length === 0){
    return {ACCEPTED:false,ERROR_MSG:"User not recognized"};
  }else{
    var email = user[0][2];
    var isAdmin = user[0][3];           
    var pass = user[0][5];
    var activated = user[0][6];
    var avatar_link = user[0][7];
    var userdata = {USERNAME:username,EMAIL:email,IMAGELINK:avatar_link,ISADMIN:isAdmin};
    if(activated){
      if(pass === password){
        ws_log.appendRow([new Date,username,true,"Log-in Accepted"]);
        return {ACCEPTED:true,ERROR_MSG:"Log-in Accepted",USERDATA:userdata};
      }else{
        ws_log.appendRow([new Date,username,false,"Incorrect Password"]);
        return {ACCEPTED:false,ERROR_MSG:"Incorrect Password",USERDATA:userdata};
      } 
    }else{
      ws_log.appendRow([new Date,username,false,"Deactivated account"]);
      return {ACCEPTED:false,ERROR_MSG:"Deactivated account",USERDATA:userdata};  
    } 
  } 
}

function LogSession(){
  
}