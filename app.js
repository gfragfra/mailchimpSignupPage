require("dotenv").config();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

let api_key = process.env.API_KEY;
let server_id = process.env.SERVER_ID;

mailchimp.setConfig({
  apiKey: api_key,
  server: server_id
});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listId = "7ce53fc3dd";

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    res.sendFile(__dirname + "/success.html")
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
  }

  run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("active on port 3000");
});
