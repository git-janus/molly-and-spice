var notificationEmailTo = "";//<----SET EMAIL ADDRESS FOR NOTIFICATION HERE

function main() {
/*
  THIS SCRIPT CAN RUN AN ANY POINT IN TIME AND CHECK ADGROUPS THE EXCEEDS TARGET CPA AND PAUSE THEM.
  AT MIDNIGHT, IT WILL REACTIVATE THOSE PAUSED ADGROUP
*/
  var nDate = new Date();
  
  var hrs = nDate.getHours();
  
  var mins = nDate.getMinutes();
  
  if(hrs < 10){hrs = '0' + hrs;}
  
  if(mins < 10){mins = '0' + mins;};
  
  var strCurrTime = hrs + ":" + mins;
  
  //CHECK'S TIME IF MIDNIGHT
  if (strCurrTime === "00:00"){//MIDNIGHT SCRIPT SPECIFIC
    
    //RE ENABLE THE PAUSED ADGROUPS IF THERE'S ANY
    var re_enabled_adGroups = iterateAdGroups(true);
    
  }else{
    
    //COLLECT ALL GROUPS EXCEEDING TARGET CPA AND PAUSE THEM
    var paused_adGroups = iterateAdGroups(false);
   
    //IF THERE ARE ADGROUP/S EXCEEDS TARGET CPA
    if(paused_adGroups.length > 0){
      
      //SEND NOTIFICATION FOR PAUSED ADGROUPS
      notifyPausedAdGroups(paused_adGroups.PAUSED,notificationEmailTo,"Google AdWord Report - Paused AdGroups",initialHtmlBody());
      
    }
    
  }
  
  Logger.log(new Date().toLocaleTimeString());
  Logger.log(strCurrTime);
}


function iterateAdGroups(renableMode){
/*
  THIS WILL GET ALL ADGROUP STATUS
  renableMode = false, PAUSE THOSE THAT EXCEEDS TARGET CPA
  renableMode = true, REACTIVATE THOSE PAUSED ADGROUPS
*/
  
  //PAUSED ADGROUPS CONTAINER
  var pausedAdGroups = [];
  
  //REACTIVATED ADGROUPS CONTAINER
  var reActivatedAdGroups = [];
  
  //GET ALL ADGROUPS
  var adGroupIterator = AdsApp.adGroups().get();
  
  //CHECK'S IF THERE'S A NEXT GROUP IN THE ITERATION
  if (adGroupIterator.hasNext()){
    
    //GET ADGROUP
    var adGroup = adGroupIterator.next();
    
    //GET ADGROUP ID
    var adGroupId = adGroup.getId();
    
    //GET ADGROUP NAME
    var adGroupName = adGroup.getName();
    
    //GET ADGROUP STATS FOR YESTERDAY
    var adGroupStats = adGroup.getStatsFor("YESTERDAY");
    
    var COST = adGroupStats.getCost();
    
    var AVECPC = adGroupStats.getAverageCpc();
    
    var AVECPM = adGroupStats.getAverageCpm();
    
    var AVECPV = adGroupStats.getAverageCpv();
    
    var CTR =  adGroupStats.getCtr();
    
    var CLICKS = adGroupStats.getClicks();
    
    var PAGEVIEWS = adGroupStats.getViews();
    
    var IMPRESSIONS = adGroupStats.getImpressions();
    
    var AVEPAGEVIEWS = adGroupStats.getAveragePageviews();
    
    var AVEPOSITION = adGroupStats.getAveragePosition();
    
    var AVETIMEONSITE = adGroupStats.getAverageTimeOnSite();
    
    var VIEWRATE = adGroupStats.getViewRate();
    
    var BOUNCERATE = adGroupStats.getBounceRate();
    
    var CONVERSIONRATE = adGroupStats.getConversionRate();
    
    var stats = {COST:COST,AVECPC:AVECPC,AVECPM:AVECPM,CTR:CTR,CLICKS:CLICKS,PAGEVIEWS:PAGEVIEWS,IMPRESSIONS:IMPRESSIONS,
                 AVEPAGEVIEWS:AVEPAGEVIEWS,AVEPOSITION:AVEPOSITION,AVETIMEONSITE:AVETIMEONSITE,
                 VIEWRATE:VIEWRATE,BOUNCERATE:BOUNCERATE,CONVERSIONRATE:CONVERSIONRATE};
   
    //GET ADGROUP BIDDING
    var CPA = adGroup.bidding().getCpa();//CPA
    
    var CPC = adGroup.bidding().getCpc();//CPC
    
    var CPM = adGroup.bidding().getCpm();//CPM
    
    //CHECK IF ADGROUP IS PAUSED
    var isAdGroupPaused = adGroup.isPaused();
    
    //GET ALL BIDDING INFO
    var bidding = {CPA:CPA,CPC:CPC,CPM:CPM};
    
    //IF collectPausedMode === true, COLLECT ALL PAUSED ADGROUP
    if (renableMode){
      
      if(isAdGroupPaused){
        
        adGroup.enable();
        
      }
      //COLLECT PAUSED ADGROUP INFO
      reActivatedAdGroups.push({ID:adGroupId,NAME:adGroupName,PAUSED:isAdGroupPaused,BIDDING:bidding,STATS:stats});
      
    }else{//IF collectPausedMode === false, CHECK FOR CPA IF EXCEEDS CPC AND PAUSE ADGROUP
      
      //CHECK'S IF CPA EXCEEDS CPC
      if ((stats.COST > bidding.CPA) && (isAdGroupPaused === false)){
      
        //PAUSE ADGROUP
        adGroup.pause();

        //COLLECT PAUSED ADGROUP INFO
        pausedAdGroups.push({ID:adGroupId,NAME:adGroupName,CPA:adGroupCPA,CPC:adGroupCPC,PAUSED:isAdGroupPaused});
      
      }
      
    }
    
  }
  
  var adGroupStats = {PAUSED:pausedAdGroups,REACTIVATED:reActivatedAdGroups};
  
  return adGroupStats;
  
}

function initialHtmlBody(){
/*
  THIS COMPOSES THE REPORT NOTIFICATION
  TABLE TEMPLATE.
  TABLE HEADERS
*/
  
  var htmlBody = "";
  
  htmlBody += "<!DOCTYPE html>";
  
  htmlBody += "<html>";
  
  htmlBody += "<head>";
  
  htmlBody += "<style>";
  
  htmlBody += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}";
  
  htmlBody += "td, th {border: 1px solid #dddddd;padding: 8px;}";
  
  htmlBody += "td {text-align: left;}";
  
  htmlBody += "</style></head><body>";
  
  htmlBody += "<h2>Paused AdGroup summary</h2>";
  
  htmlBody += "<table>";
  
  htmlBody += "<tr><th colspan=3>AdGroup Info</th><th colspan=3>Bidding</th><th colspan=13>Yesterday Stats</th></tr>";
  
  htmlBody += "<tr><th>ID</th><th>Name</th><th>is Paused</th><th>CPA</th><th>CPC</th><th>CPM</th><th>Cost</th><th>Ave CPC</th>";
  
  htmlBody += "<th>Ave CPM</th><th>CTR</th><th>Clicks</th><th>Page Views</th><th>Impressions</th><th>Ave Page Views</th><th>Ave Position</th>";
  
  htmlBody += "<th>Ave Time on Site</th><th>View Rate</th><th>Bounce Rate</th><th>Converstion Rate</th></tr>";
  
  return htmlBody;
  
}

function notifyPausedAdGroups(adGroupStats,emailTo,emailSubject,initialHtmlBody){
/*
  THIS WILL COMPOSE AN EMAIL AND SEND THE PAUSED ADGROUP REPORT
*/
  
  //INITIAL EMAIL BODY REPORT TABLE
  var htmlBody = initialHtmlBody();
  
  //ITERATE THE PAUSED ADGROUPS COLLECTED
  for(var i=0; i<adGroupStats.length; i++){//pausedAdGroups.length; i++){
    
    var ID = adGroupStats.ID;
    
    var Name = adGroupStats.NAME;
    
    var isPaused = adGroupStats.PAUSED;
    
    var CPA = adGroupStats.BIDDING.CPA;
    
    var CPC = adGroupStats.BIDDING.CPC;
    
    var CPM = adGroupStats.BIDDING.CPM;
    
    var Cost = adGroupStats.STATS.COST;
    
    var AveCPC = adGroupStats.STATS.AVECPC;
    
    var AveCPM = adGroupStats.STATS.AVECPM;
    
    var CTR = adGroupStats.STATS.CTR;
    
    var Clicks = adGroupStats.STATS.CLICKS;
    
    var PageViews = adGroupStats.STATS.PAGEVIEWS;
    
    var Impressions = adGroupStats.STATS.IMPRESSIONS;
    
    var AvePageViews = adGroupStats.STATS.AVEPAGEVIEWS;
    
    var AvePosition = adGroupStats.STATS.AVEPOSITION;
    
    var AveTimeOnSite = adGroupStats.STATS.AVETIMEONSITE;
    
    var ViewRate = adGroupStats.STATS.VIEWRATE;
    
    var BounceRate = adGroupStats.STATS.BOUNCERATE;
    
    var ConversionRate = adGroupStats.STATS.CONVERSIONRATE;
    
    //COMPLETES THE REPORT TABLE
    htmlBody += "<tr><td>" + ID + "</td><td>" + Name + "</td><td>" + isPaused + "</td><td>" + CPA + "</td><td>" + CPC + "</td><td>" + CPM + "</td><td>" + Cost + "</td><td>" + AveCPC + "</td>";
    
    htmlBody += "<td>" + AveCPM + "</td><td>" + CTR + "</td><td>" + Clicks + "</td><td>" + PageViews + "</td><td>" + Impressions + "</td><td>" + AvePageViews + "/td><td>" + AvePosition + "</td>";
    
    htmlBody += "<td>" + AveTimeOnSite + "</td><td>" + ViewRate + "</td><td>" + BounceRate + "</td><td>" + ConversionRate + "</td></tr>";
    
  }
  
  htmlBody += "</table></body></html>";
 
  //SENDS THE NOTIFICATION/PAUSED ADGROUP REPORT
  MailApp.sendEmail({
    to: emailTo,
    subject: emailSubject,
    htmlBody: htmlBody,
  });
  
}