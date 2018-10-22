import ejs from 'ejs';
import {join} from 'path';
import {readFile} from 'fs';
import express from 'express';
import compression from 'compression';
import basicAuth from 'basic-auth';

/* eslint-disable no-unused-vars */
import {h} from 'preact';
/* eslint-enable no-unused-vars */
import render from 'preact-render-to-string';

import App from './src/components/App.js';

const app = express();

app.use(compression());
app.use('/dist', express.static('dist'));

app.get('/', (req, res) => {
	readFile('./src/index.ejs', (err, buff) => {
		const tpl = ejs.compile(buff.toString());

		const out = tpl({
			distPath: '/dist',
			ssrData: d,
			rendered: render(<App />),
		});

		res
				.status(200)
				.send(out)
				.end();
	});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, _ => {
	console.log(`App listening on port ${PORT}`);
});
