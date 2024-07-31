const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

// ID de l'utilisateur Discord qui doit être admin
const newAdminDiscordId = '1268194529593528354';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: '1255853786505678869', // Remplacez par votre Client ID
    clientSecret: 'dheSROeH6xLPrLt6n2aB-hVUswp1Vlop', // Remplacez par votre Client Secret
    callbackURL: 'http://localhost:3000/auth/discord/callback', // Assurez-vous que cela correspond
    scope: ['identify']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ discordId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        
        // Vérifiez si le nouvel utilisateur Discord doit être admin
        const isNewAdmin = profile.id === newAdminDiscordId;

        const newUser = new User({
            discordId: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            role: isNewAdmin ? 'admin' : 'user',
            status: 'neutre' // ou autre statut par défaut
        });
        let savedUser = await newUser.save();
        done(null, savedUser);
    } catch (err) {
        done(err, null);
    }
}));
