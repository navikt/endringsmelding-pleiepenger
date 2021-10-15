const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/webpack.config.dev');
const configureDevServer = require('../webpack/devserver.config');
const path = require('path');

require('dotenv').config();

const compiler = webpack({
    ...webpackConfig,
    watch: false,
    watchOptions: { ignored: path.resolve(`${__dirname}../../../node_modules`), poll: 1000 },
});
const server = new WebpackDevServer(compiler, configureDevServer({}));

server.listen(8080, '127.0.0.1', () => console.log('Started server on http://localhost:8080'));
