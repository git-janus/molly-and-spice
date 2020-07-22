<script>
 function log_attendance(){
   var time = new Date();
   var fname = document.getElementById('fname').value;
   var lname = document.getElementById('lname').value;
   var email = document.getElementById('email').value;
   google.script.run.withFailureHandler(logFailed).withSuccessHandler(clearFields).writeToDb([time.toString(),fname,lname,email]);
 }
 
 function clearFields(){
   document.getElementById('fname').value = ""
   document.getElementById('lname').value = ""
   document.getElementById('email').value = ""
   alert("Log Successful!");
 }
 
 function logFailed(){
   alert("Log Failed!");
 }
</script>