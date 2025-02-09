// filepath: /mern-stack-app/mern-stack-app/backend/src/routes/dataRoutes.js

const express = require('express');
const DataController = require('../controllers/dataController');

const router = express.Router();
const dataController = new DataController();

const setRoutes = (app) => {
    app.use('/data', router);
    router.get('/', dataController.fetchData.bind(dataController));
};

module.exports = setRoutes;