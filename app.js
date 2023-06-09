const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/cf4c5769b8"
    const options = {
        method: "POST",
        auth: "anmbajaj:3575d7dd6f57b6a9f9f76dbd5852160c-us21"
    }

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server running at port 3000");
});

//3575d7dd6f57b6a9f9f76dbd5852160c-us21
//cf4c5769b8