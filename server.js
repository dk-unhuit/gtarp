const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./models/User');
const QuestionnaireResponse = require('./models/QuestionnaireResponse');
require('./config/passport-setup');
const { isAuthenticated, isAdmin } = require('./middleware/auth');
const moment = require('moment');

const app = express();

const MONGO_URI = 'mongodb+srv://djeakarti:kIoW4tIGCOWZWtwq@uslife.wmdf6zd.mongodb.net/?retryWrites=true&w=majority&appName=USLife';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin-home');
    } else {
        res.redirect('/home');
    }
});

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/admin-home', isAdmin, (req, res) => {
    res.render('admin-home', { user: req.user });
});

app.get('/admin/gestion', isAdmin, async (req, res) => {
    try {
        const { query, filter } = req.query;
        console.log(`Query: ${query}`);
        console.log(`Filter: ${filter}`);

        let searchCriteria = {};

        if (query) {
            switch (filter) {
                case 'username':
                    searchCriteria = { 'user.username': { $regex: query, $options: 'i' } };
                    break;
                case 'discordId':
                    searchCriteria = { 'user.discordId': { $regex: query, $options: 'i' } };
                    break;
                case 'date':
                    let startDate;
                    let endDate;
                    if (moment(query, 'DD/MM/YYYY/HH[h]mm', true).isValid()) {
                        startDate = moment(query, 'DD/MM/YYYY/HH[h]mm').toDate();
                        endDate = moment(startDate).add(1, 'minute').toDate();
                    } else if (moment(query, 'DD/MM/YYYY', true).isValid()) {
                        startDate = moment(query, 'DD/MM/YYYY').startOf('day').toDate();
                        endDate = moment(query, 'DD/MM/YYYY').endOf('day').toDate();
                    } else {
                        startDate = null;
                        endDate = null;
                    }
                    
                    if (startDate && endDate) {
                        searchCriteria = { createdAt: { $gte: startDate, $lt: endDate } };
                    }
                    break;
                case 'clan':
                    searchCriteria = { clan: { $regex: query, $options: 'i' } };
                    break;
                default:
                    searchCriteria = {};
            }
        }

        console.log('Search Criteria:', searchCriteria);

        const responses = await QuestionnaireResponse.aggregate([
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $match: searchCriteria }
        ]);

        console.log('Responses:', responses);

        res.render('gestion', { responses });
    } catch (error) {
        console.error('Erreur lors de la récupération des réponses :', error);
        res.status(500).send('Erreur du serveur');
    }
});

app.get('/clan/civils', isAuthenticated, (req, res) => {
    res.render('civils', { user: req.user });
});

app.get('/clan/service_publique', isAuthenticated, (req, res) => {
    res.render('service_publique', { user: req.user });
});

app.get('/clan/illegal', isAuthenticated, (req, res) => {
    res.render('illegal', { user: req.user });
});

app.post('/clan/service_publique', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const { q1, q2 } = req.body;

        const newResponse = new QuestionnaireResponse({
            userId: userId,
            clan: 'Service Publique',
            responses: { q1, q2 }
        });

        await newResponse.save();

        await User.findByIdAndUpdate(userId, { status: 'attente', clan: 'Service Publique' });

        res.status(200).json({ message: 'Réponses enregistrées avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des réponses :', error);
        res.status(500).json({ message: 'Les réponses n\'ont pas pu être enregistrées.' });
    }
});

app.post('/clan/illegal', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const { q1, q2 } = req.body;

        const newResponse = new QuestionnaireResponse({
            userId: userId,
            clan: 'Illégale',
            responses: { q1, q2 }
        });

        await newResponse.save();

        await User.findByIdAndUpdate(userId, { status: 'attente', clan: 'Illégale' });

        res.status(200).json({ message: 'Réponses enregistrées avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des réponses :', error);
        res.status(500).json({ message: 'Les réponses n\'ont pas pu être enregistrées.' });
    }
});

app.post('/clan/civils', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const { q1, q2 } = req.body;

        const newResponse = new QuestionnaireResponse({
            userId: userId,
            clan: 'Civils',
            responses: { q1, q2 }
        });

        await newResponse.save();

        await User.findByIdAndUpdate(userId, { status: 'attente', clan: 'Civils' });

        res.status(200).json({ message: 'Réponses enregistrées avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des réponses :', error);
        res.status(500).json({ message: 'Les réponses n\'ont pas pu être enregistrées.' });
    }
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur du serveur');
    }
});

app.get('/admin/reponses/:id', isAdmin, async (req, res) => {
    try {
        const response = await QuestionnaireResponse.findById(req.params.id).populate('userId', 'username discordId');
        if (!response) {
            return res.status(404).send('Réponse non trouvée');
        }
        res.render('reponses', { response });
    } catch (error) {
        console.error('Erreur lors de la récupération des réponses :', error);
        res.status(500).send('Erreur du serveur');
    }
});

app.post('/admin/update-status/:id', isAdmin, async (req, res) => {
    try {
        const responseId = req.params.id;
        const { status } = req.body;
        const response = await QuestionnaireResponse.findById(responseId).populate('userId');

        if (response) {
            response.status = status;
            await response.save();
            res.status(200).json({ message: 'Statut mis à jour.' });
        } else {
            res.status(404).json({ message: 'Réponse non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
    }
});

app.post('/admin/accept/:id', isAdmin, async (req, res) => {
    try {
        const responseId = req.params.id;
        const response = await QuestionnaireResponse.findById(responseId).populate('userId');

        if (response) {
            await User.findByIdAndUpdate(response.userId._id, { status: 'accepté' });
            await QuestionnaireResponse.findByIdAndDelete(responseId);
            res.redirect('/admin/gestion');
        } else {
            res.status(404).json({ message: 'Réponse non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande :', error);
        res.status(500).json({ message: 'Erreur lors de l\'acceptation de la demande.' });
    }
});

app.post('/admin/reject/:id', isAdmin, async (req, res) => {
    try {
        const responseId = req.params.id;
        const response = await QuestionnaireResponse.findById(responseId).populate('userId');

        if (response) {
            await User.findByIdAndUpdate(response.userId._id, { status: 'refusé', clan: '' });
            await QuestionnaireResponse.findByIdAndDelete(responseId);
            res.redirect('/admin/gestion');
        } else {
            res.status(404).json({ message: 'Réponse non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur lors du refus de la demande :', error);
        res.status(500).json({ message: 'Erreur lors du refus de la demande.' });
    }
});