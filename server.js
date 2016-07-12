 var restify = require('restify');
 var builder = require('botbuilder');
 var request = require('request');
 

 var bot = new builder.BotConnectorBot();
 
 
 //https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=0d6df140e73b4f07a204058a0769d60e&q=When%20is%20next%20holiday
 var model = 'https://api.projectoxford.ai/luis/v1/application?id=814f9a05-0e84-41f4-aec9-f205211b3a46&subscription-key=0d6df140e73b4f07a204058a0769d60e&q=';
 var dialog = new builder.LuisDialog(model);

var host = "http://10.12.40.86"
var base_url = "/mobile/hrms_web_services/services/index.php?"


var sessionID = null
var username = null
var password = null
var emp_number = null
var current_leave_count = null
 
 bot.add('/', dialog);

 bot.add('/login',[ function (session) {
        username = null
        password = null
		builder.Prompts.text(session, 'Enter your username and password for login. First Enter your username.');
	},
	function (session, results, next) {
		username = results.response;
	//	console.log('username = %s',username);
		builder.Prompts.text(session, 'Enter your Domain Password');
	},
	function (session, results, next) {
		password = results.response;
        session.send('Please wait... I am logging in for you...');
		//console.log('passowrd = %s',password);
	

        //Call login API of HRMS with user Input
        login(username, password,function (token, emp_num, err) {
		
			if(token == null) {
				builder.Prompts.choice(session, "Something went wrong while logging in. Retry?", ["yes", "no"]);
                 next();
			}
			else {
				
				//set received token and emp_num to program vars for future work
				sessionID = token;
				emp_number = emp_num;
                session.send('You are now logged into HRMS');
                session.endDialog(); //For BotconnectorBot
			  //session.replaceDialog('/'); //For Textbot to test scenario
			}
		}); 
       
 },
 function (session, results, next) {
		if(results.response) {
			var choice = results.response.entity;
			//console.log('choice entered = %s', choice);
			if(choice == "yes") {
				//session.endDialog();
				session.beginDialog("/login");
			}
			else {
				session.endDialog();		
			}
		}
       	
	}
 
 ]);
 

 dialog.on('CheckLeave', [function (session) {
	if (sessionID != null && emp_number != null) {
		    session.send("your previous session is still alive, you can continue with HRMS Task..");
       
		}//end elseif
		else {
			session.beginDialog('/login'); //do not have token so ask to login
          
        }

}]


);
 dialog.on('CheckHoliday',function (session, args) {

    session.send("Next Holiday is 'Independece Day' on Monday July 04 2016");
});
 dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
 

 function login(uname, pwd,callback) {

//http://10.12.40.86/mobile/hrms_web_services/services/index.php?data={"method":"login","params":{"username":"shailesh.kanzariya","password":"DoaminPassword”}}
var propertiesObject =  "data={\"method\":\"login\",\"params\":{\"username\":\"" +uname+ "\",\"password\":\"" +pwd+ "\"}}"   

var options = {
  uri: host+base_url+propertiesObject
  
};

request(options, function (error, response, body) {

   // console.log(body) // Show the HTML for the Google homepage.
   var jsonData = JSON.parse(body);
   if (jsonData.error)
   {
//console.log('Error = ', jsonData.message);
       callback(null,null,jsonData.message)
   }
   else{
       // console.log('token = ', jsonData.token);
		//console.log('emp_number =', jsonData.emp_number);
        callback(jsonData.token,jsonData.emp_number,null)
   }
	
});
}

 var server = restify.createServer();

server.post('/v1/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 8080, function () {
     console.log('%s listening to %s', server.name, server.url); 
 });
 
 

 //bot.listenStdin()

