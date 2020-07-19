function doGet(request) {
  
  var params = JSON.parse(JSON.stringify(request));
  var uname = params.parameter.username;
  var email = params.parameter.email;
  var imgUrl = params.parameter.imgUrl;
  var default_imgUrl = "https://www.pngfind.com/pngs/m/381-3819326_default-avatar-svg-png-icon-free-download-avatar.png";
  var html = HtmlService.createTemplateFromFile('HTML').evaluate().getContent();
  html = html.replace(default_imgUrl, imgUrl);
  html = html.replace('<a id="user_name">User Name</a>','<a id="user_name">' + uname + '</a>');
  html = html.replace('<a id="email">email</a>','<a id="email">' + email + '</a>');
  return HtmlService.createHtmlOutput(html)
  .setTitle('LANDING PAGE | ' + uname);

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}

function LOGOUT(uname){
  var ss = SpreadsheetApp.openById("1U7sWHbli6npx4RyuwYpoNa1kZS_rzpY8AsDVVYB3av8");
  var ws_log = ss.getSheetByName("Login History");
  ws_log.appendRow([new Date(),uname,false,"Logged out"]);
  var login_urls = {DEV:"https://script.google.com/macros/s/AKfycbzRFrHJYuRmvwbb5dvHQZR9_MYGbCJFCPyXsvfvVMIR/dev",
                   EXEC:"https://script.google.com/macros/s/AKfycbw4Aal12GLsTNUqKldrbKqUKV_QCWMakTVniBr80OCsPNqkmtqk/exec"};
  return login_urls.EXEC;
}