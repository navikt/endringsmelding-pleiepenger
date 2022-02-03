const path = require('path');
const mustacheExpress = require('mustache-express');
const envSettings = require('../../../envSettings');
require('dotenv').config();

const configureDevServer = (decoratorFragments) => ({
    setupMiddlewares: (middlewares, devServer) => {
        devServer.app.engine('html', mustacheExpress());
        devServer.app.set('views', `${__dirname}/../../../dist/dev`);
        devServer.app.set('view engine', 'mustache');
        devServer.app.get(`${process.env.PUBLIC_PATH}/dist/settings.js`, (req, res) => {
            res.set('content-type', 'application/javascript');
            res.send(`${envSettings()}`);
        });
        devServer.app.get(`/dist/settings.js`, (req, res) => {
            res.set('content-type', 'application/javascript');
            res.send(`${envSettings()}`);
        });
        devServer.app.get(`/dist/js/settings.js`, (req, res) => {
            res.sendFile(path.resolve(`${__dirname}/../../../dist/js/settings.js`));
        });
        devServer.app.get(/^\/(?!.*dist).*$/, (req, res) => {
            res.render('index.html', Object.assign(decoratorFragments));
        });
        return middlewares;
    },
    devMiddleware: {
        index: true,
        stats: 'minimal',
        publicPath: `${process.env.PUBLIC_PATH}/dist`,
    },
    static: {
        directory: path.resolve(`${__dirname}/../../../dist`),
        serveIndex: true,
        watch: true,
    },
});

// const configureDevServer = (decoratorFragments, port) => ({
//     onBeforeSetupMiddleware: (devServer) => {
//         devServer.app.engine('html', mustacheExpress());
//         devServer.app.set('views', `${__dirname}/../../../dist/dev`);
//         devServer.app.set('view engine', 'mustache');
//         devServer.app.get(`${process.env.PUBLIC_PATH}/dist/settings.js`, (req, res) => {
//             res.set('content-type', 'application/javascript');
//             res.send(`${envSettings()}`);
//         });
//         devServer.app.get(`/dist/settings.js`, (req, res) => {
//             res.set('content-type', 'application/javascript');
//             res.send(`${envSettings()}`);
//         });
//         devServer.app.get(`/dist/js/settings.js`, (req, res) => {
//             res.sendFile(path.resolve(`${__dirname}/../../../dist/js/settings.js`));
//         });
//         devServer.app.get(/^\/(?!.*dist).*$/, (req, res) => {
//             res.render('index.html', Object.assign(decoratorFragments));
//         });
//     },
//     port,
// });

module.exports = configureDevServer;
