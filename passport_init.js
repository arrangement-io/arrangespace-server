const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const core = require('./api/internal/core');
let db = require('./db/database_mongo');

const WHITELIST_DOMAINS = ['gpmail.org'];
const WHITELIST_EMAILS = [
  'kuo-ching_chiu@berkeley.edu',
  'gideon.chia@gmail.com',
  'fredkimdesign@gmail.com',
  'haohowardguan@gmail.com',
  'dkinder.is.me@gmail.com',
  'shanrauf@berkeley.edu',
  'richardruan@berkeley.edu',
  'esu@berkeley.edu',
  'peter.trost@berkeley.edu',
  'chibuzorobiorah@berkeley.edu',
  'cindyllo616@gmail.com',
  'jamesdangyellow@gmail.com',
  'mjlikre@gmail.com',
  'wu.cherry@berkeley.edu',
  'jyen83@gmail.com',
  'jenny.chen@gpmail.org'];

const getDomain = (email) => {
  if (email !== undefined) {
    const parts = email.split(`@`);
    if (parts.length === 2) {
      return parts[1];
    }
  }
  core.log(`email does not have domain: ${email}`);
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback'
},
function (token, tokenSecret, profile, cb) {
  if (profile) {
    const email = profile._json.email || profile.emails[0].value;
    const domain = profile._json.hd || getDomain(email);
    const user = { googleId: profile.id,
      name: profile.displayName,
      givenName: profile.name.givenName,
      familyName: profile.name.familyName,
      imageUrl: profile._json.picture,
      email: email
    };
    core.log(`domain: ${domain}`);
    core.log(`whitelist domain: ${WHITELIST_DOMAINS.indexOf(domain)}`);
    core.log(profile._json);
    if (WHITELIST_DOMAINS.indexOf(domain) === -1 && WHITELIST_EMAILS.indexOf(email) === -1) {
      return cb(new Error(`Invalid Domain: ${domain} and Invalid Email: ${email}`));
    }
    db.createUserByGoogleId({ user_data: user });
    return cb(null, user);
  }
  return cb(new Error(`Could not create or find user with profile: ${profile}`));
}));

passport.serializeUser(function (user, done) {
  done(null, user.googleId);
});

passport.deserializeUser(function (id, done) {
  db.getUser(id).then(user => {
    done(null, user);
  });
});
