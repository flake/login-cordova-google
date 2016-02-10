Accounts.registerLoginHandler(function(req) {
    check(req, {
        email: String,
        oAuthToken: String,
        profile: Match.Any,
        sub: String
    });

    var user = Meteor.users.findOne({
            // "services.google.email": req.email,
            "services.google.id": req.sub
        }),
        userId = null;

    if (!user) {
        var res = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "User-Agent": "Meteor/1.0"
            },

            params: {
                access_token: req.oAuthToken
            }
        });

        if (res.error) throw res.error;
        else {
            if ( /* req.email == res.data.email && */ req.sub == res.data.sub) {
                var googleResponse = _.pick(res.data, "email", "email_verified", "family_name", "gender", "given_name", "locale", "name", "picture", "profile", "sub");

                googleResponse["accessToken"] = req.oAuthToken;
                googleResponse["id"] = req.sub;

                if (typeof(googleResponse["email"]) == "undefined") {
                    googleResponse["email"] = req.email;
                }

                //check for email signup
                var existUser = Meteor.users.findOne({"emails.address": googleResponse["email"]});
                if(existUser){
                  existUser.services.google = googleResponse;
                  console.log("google services update...");
                }else{
                  existUser = {
                      createdAt: new Date(),
                      // profile: googleResponse,
                      services: {
                          google: googleResponse
                      },
                      emails: [
                        {
                          "address": googleResponse["email"],
                          "verified": true
                        }
                      ]
                  };
                }

                if (req.profile && (req.profile instanceof Array)) { // fill profile according to req.profile
                    if (0 < req.profile.length) {
                        if( existUser.profile === undefined )
                          existUser.profile = {};

                        for (var A = 0; A < req.profile.length; A++) {
                            if (_.has(googleResponse, req.profile[A])) {
                                existUser.profile[req.profile[A]] = googleResponse[req.profile[A]];
                            }
                        }
                    }
                }

                Meteor.users.remove({_id: existUser._id});
                userId = Meteor.users.insert(existUser);
            } else throw new Meteor.Error(422, "AccessToken MISMATCH in flake:login-cordova-google");
        }
    } else userId = user._id;

    var stampedToken = Accounts._generateStampedLoginToken();
    var stampedTokenHash = Accounts._hashStampedToken(stampedToken);

    Meteor.users.update({
        _id: userId
    }, {
        $push: {
            "services.resume.loginTokens": stampedTokenHash
        }
    });

    return {
        token: stampedToken.token,
        userId: userId
    };
});
