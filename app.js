const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { sendFile } = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+ "/signup.html");

});

app.post("/", function(req, res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fName,
                    LNAME:lName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/cf85506d31";
    const options = {
        method: "POST",
        auth: "SUPANAT:2775f58d6c520b83ea697fd919452217-us20"

    }

  

    const request =  https.request(url, options, function(response){
        response.on("data",function(data){
            console.log(response.statusCode);
            if (response.statusCode === 200){
                res.sendFile(__dirname+"/success.html");
            }else{
                res.sendFile(__dirname+"/failure.html");
              
            }
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});


// api key 2775f58d6c520b83ea697fd919452217-us20

//  id cf85506d31.

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running.");
});
