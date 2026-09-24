const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const login = require("fca-unofficial");
const fs = require("fs");

app.get('/', (req, res) => {
  res.send('LYNEX × BOT is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Bot Login & Listener
if(fs.existsSync('appstate.json')) {
  try {
    const appStateContent = fs.readFileSync('appstate.json', 'utf8');
    if (appStateContent.trim() !== "" && appStateContent.trim() !== "[]") {
      login({appState: JSON.parse(appStateContent)}, (err, api) => {
        if(err) {
          console.error("Login error:", err);
          return;
        }
        
        console.log("LYNEX × BOT logged in successfully!");
        api.setOptions({listenEvents: true});

        api.listen((err, event) => {
          if(err) return console.error(err);

          if(event.type === "message" && event.body) {
            if(event.body.toLowerCase() === "hi") {
              api.sendMessage("Hello! LYNEX BOT is active.", event.threadID);
            }
          }
        });
      });
    } else {
      console.log("appstate.json is empty. Please add your facebook cookies.");
    }
  } catch (e) {
    console.error("Error reading appstate:", e);
  }
}
