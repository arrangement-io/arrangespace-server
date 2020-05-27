const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
let db = require('./db/database_mongo');

const WHITELIST_DOMAINS = ['gpmail.org'];
const WHITELIST_EMAILS = [
  'kuo-ching_chiu@berkeley.edu',
  'gideon.chia@gmail.com',
  'fredkimdesign@gmail.com',
  'haohowardguan@gmail.com',
  'dkinder.is.me@gmail.com',
  'shanrauf@berkeley.edu',
  'alexandernewman@berkeley.edu',
  'richardruan@berkeley.edu',
  'esu@berkeley.edu',
  'daniel.yoon35@gmail.com',
  'jjlinucb@berkeley.edu',
  'peter.trost@berkeley.edu',
  'chibuzorobiorah@berkeley.edu',
  'cindyllo616@gmail.com',
  'jamesdangyellow@gmail.com',
  'johnangeles@berkeley.edu',
  'wu.cherry@berkeley.edu'];

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback'
},
function (token, tokenSecret, profile, cb) {
  if (profile) {
    const email = profile.emails[0].value;
    const domain = profile._json.hd;
    const user = { googleId: profile.id,
      name: profile.displayName,
      givenName: profile.name.givenName,
      familyName: profile.name.familyName,
      imageUrl: profile._json.picture,
      email: email
    };
    if (WHITELIST_DOMAINS.indexOf(domain) === -1 && WHITELIST_EMAILS.indexOf(email) === -1) {
      return cb(new Error('Invalid Domain'));
    }
    db.createUserByGoogleId({ user_data: user });
    return cb(null, user);
  }
  return cb(new Error('Could not create or find user'));
}));

passport.serializeUser(function (user, done) {
  done(null, user.googleId);
});

passport.deserializeUser(function (id, done) {
  db.getUser(id).then(user => {
    done(null, user);
  });
});
