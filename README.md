# SpotiRank
Raspberry Pi and Arduino project that looks up your top songs in Spotify and makes you guess which one was ranked higher. The Raspberry Pi runs the web server and uses Johnny-Five to contorl the Arduino. Users login to their Spotify through the web server and must be playing a song on their intended device for the application to register the active device.

## Setup
* Create a Spotify developer app<br/>
* Add http://<IP_ADDRESS>:8888/callback to Redirect URIs in your Spotify app settings, where <IP_ADDRESS> is your Raspberry Pi's IP address<br/>
* Install node.js<br/>
* In config.js, fill in your Raspberry Pi IP address, client_id, and client_secret from your Spotify app<br/>
* Configure your pins in arduino.js<br/>

## Run
```
npm install
node app.js
```

## Example
[Imgur](https://i.imgur.com/9yrdJfk.mp4)
