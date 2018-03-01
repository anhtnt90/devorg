window.onerror = function (msg, url, line, column, errorObj) {
   if(errorObj.faultstring == undefined){
        var details =  msg+' : line: '+line+ ' and column: '+column;
		var errorObj2 = {faultcode:errorObj, faultstring:details};
      hebLogger('Error',errorObj2);
       
    } else{
   
    
     hebLogger('Error',errorObj);
    }
    }

function hebDebug(message){
hebLogger('Debug', message);
  }
function hebEvent(message){
hebLogger('Event', message);
  }

function hebError(error){
    if(error.errors != undefined){
       
        subject = error.errors.statusCode;
        details = error.errors.message;
        
    }else{
        
        subject = error.faultcode;
        
        details = error.faultstring;
         }
   var errorObj = {faultcode:subject, faultstring:details};
hebLogger('Error', errorObj);
 
 }

function hebLogger(type, message){
    var logger = new sforce.SObject("HEB_Javascript_Log__c");
	var browser = get_browser_info();
     logger.Browser__c = browser.name + ' version: '+browser.version;
	currentURL = $(location).attr('href');
    logger.URL__c = currentURL; 
    logger.Type__c = type;
    if(type == 'Error'){
        logger.Message__c = message.faultcode;
	logger.Details__c = message.faultstring;  
    }else{
        logger.Message__c = message;
      }
  var result = sforce.connection.create([logger]); 
    
    
}
  function get_browser_info(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE ',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }
