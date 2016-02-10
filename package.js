Package.describe({
  name: "flake:login-cordova-google",
  summary: "Meteor Cordova Google Plus SignIn for Android/IOS App",
  documentation: "README.md"
});

Cordova.depends({
  "cordova-plugin-googleplus": "https://github.com/EddyVerbruggen/cordova-plugin-googleplus.git#3ae99ea5d24619949613b87cdcb01b407199c253"
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.0");

  api.use([
    "accounts-base",
    "check"
  ], ["client", "server"]);

  api.use([
    "http",
    "underscore"
  ], ["server"]);

  api.imply(["accounts-base"], ["client", "server"]);

  api.add_files([
    "server/loginCordovaGoogle.js"
  ], ["server"]);

  api.add_files([
    "cordova/loginCordovaGoogle.js"
  ], ["web.cordova"]);
});
