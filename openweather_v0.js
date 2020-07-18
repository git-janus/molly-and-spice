function main(){
  
  //base url
  var api_url = 'http://api.openweathermap.org/data/2.5/weather?';
  
  //Write your openweather.org api key here
  var api_key = 'XXXXXXXXXXXXXXXXXXX';//<---openweather API key here

  //Get's city open weather org id
  var open_weather_org_id = GETCITYOPENWEATHERMAPID('Tokyo');//<---Sample city
  
  Logger.log('\t\tTarget OpenWeatherOrg City ID : ' + open_weather_org_id);
  
  //Get's current city open weather data
  var weather_data = CURRENTWEATHER(open_weather_org_id,api_url,api_key);
  
  Logger.log('\t\tWeather description : ' + weather_data.weather[0].description);
  
  Logger.log(weather_data);
 
}

/*
THIS IS A JSON FORMAT FOR CITIES LIST AND ITS CORRESPONDING OPENWEATHERMAP IDS. 
YOU CAN FIND OTHER CITY DETATILS IN THIS SITE (http://web.archive.org/web/20180619015316/http://openweathermap.org/help/city_list.txt)
*/
function GETCITYOPENWEATHERMAPID(city){
  var AdWord_Map = {
  					"Hokkaido":[{"Criteria_ID":20624, "Name":"Hokkaido", "Canonical_Name":"Hokkaido,Japan", "Prefecture":"Hokkaido", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":2128295}],
                    "Saitama":[{"Criteria_ID":20634, "Name":"Saitama Prefecture", "Canonical_Name":"Saitama Prefecture,Japan", "Prefecture":"Saitama", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":6940394}],
                    "Chiba":[{"Criteria_ID":20635, "Name":"Chiba Prefecture", "Canonical_Name":"Chiba Prefecture,Japan", "Prefecture":"Chiba", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":2113015}],
                    "Tokyo":[{"Criteria_ID":20636, "Name":"Tokyo", "Canonical_Name":"Tokyo,Japan", "Prefecture":"Tokyo", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":1850147}],
                    "Kanagawa":[{"Criteria_ID":20637, "Name":"Kanagawa Prefecture", "Canonical_Name":"Kanagawa Prefecture,Japan", "Prefecture":"Kanagawa", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":1848354}],
                    "Niigata":[{"Criteria_ID":20638, "Name":"Niigata", "Canonical_Name":"Niigata,Japan", "Prefecture":"Niigata", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":1855431}],
                    "Toyama":[{"Criteria_ID":20639, "Name":"Toyama Prefecture", "Canonical_Name":"Toyama Prefecture,Japan", "Prefecture":"Toyama", "Parent_ID":2392, "Country_Code":"JP", "Target_Type":"Prefecture", "Status":"Active", "Open_Weather_Map_ID":1849876}],
                    };
    return AdWord_Map[city][0].Open_Weather_Map_ID.toString();
}

function CURRENTWEATHER(city_id,api_url,api_key){
  
  //Combines the credentials to complete the desired api url
  var api_url_id = api_url + 'id=' + city_id + '&appid=' + api_key;
  
  //Fetch the url from api link
  var response = UrlFetchApp.fetch(api_url_id.toString());
  
  var json = response.getContentText();
  
  var weather_data = JSON.parse(json);
  
  return weather_data;
  
}