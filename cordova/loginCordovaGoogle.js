/*
 * @summary Meteor cordova client for google plus sign in
 * @namespace Meteor
 */

 Meteor.loginCordovaGoogle = function(request, callback){
   /*
    * @function loginCordovaGoogle
    * @summary Function to call native google plus login only available in cordova apps
    * @memberof Meteor
    * @param {Object} request an object with google plus login details
    * @param {Array} request.profile Is an array of profile properties required, eg. `["email", "email_verified", "gender"]`
    * @param {Function} callback `callback` function can have one argument `error` which will be containing the details of error if any
    */

   window.plugins.googleplus.login({
           offline: true
       },
       function(response) {
           request.email = response.email;
           request.oAuthToken = response.oauthToken;
           request.sub = response.userId;

           Accounts.callLoginMethod({
               methodArguments: [request],
               userCallback: callback
           });
       },
       function(error) {
           if (callback && (typeof callback == "function")) callback(error);
           else alert(error);
       }
   );
 }
