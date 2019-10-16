import ejs from 'ejs';
import {join} from 'path';
import {readFile, writeFile} from 'fs';
import {mkdirp} from 'mkdirp';

import React from 'react';
import {renderToString} from 'react-dom/server';

import labs from './src/lab';
import clients from './src/clients';

import {App} from './src/components/App.js';
import {RouterContext} from "@stilva/transitionable-react-router";

readFile('./src/index.ejs', (err, buff) => {
  const tpl = ejs.compile(buff.toString());
  const boundWriteToFile = writeToFile.bind(null, tpl);

  ['/', '/lab', '/client'].concat(
    getLabs(),
    getClients()
  )
    .forEach(boundWriteToFile);
});

function getClients() {
  return Array
    .from(clients.keys())
    .map(slug => `/client/${slug}`)
}

function getLabs() {
  return Object
    .keys(labs)
    .map(slug => `/lab/${slug}`)
}

function writeToFile(tpl, path) {
  const out = tpl({
    distPath: '/dist',
    rendered: renderToString(<RouterContext.Provider value={{currentRoute: path}}>
      <App/>
    </RouterContext.Provider>)
  });

  const filename = join(`${path === '/' ? 'index' : path}.html`);

  const folderPattern = /^(\/.+\/)?[^\.]+\.(?:html)$/ig;
  const match = folderPattern.exec(filename);

  if (!match) return;

  pMakeDirOrSkip({prefix: './dist', folder: match[1], uri: filename})
    .then(({prefix, folder, uri}) => {
      writeFile(join(prefix, uri), out, err => {
        if (err) {
          console.log('Error while writing to file', err.toString())
        }
      });
    });
}

function pMakeDirOrSkip({prefix, folder, uri}) {
  return new Promise(resolve => {
    if (!folder) {
      return resolve({prefix, folder, uri});
    }

    return pMkdirp({prefix, folder, uri})
      .then(resolve);
  });
}

function pMkdirp({prefix, folder, uri}) {
  return new Promise(resolve => {
    mkdirp(`${prefix}${folder}`, function (err) {
      if (err) {
        console.error("ERROR", err.toString())
        process.exit();
      }

      resolve({prefix, folder, uri});
    });
  });
}
