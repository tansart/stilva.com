import ejs from 'ejs';
import {join, resolve} from 'path';
import {readFile, writeFile} from 'fs';
import {mkdirp} from 'mkdirp';
import {ChunkExtractor} from '@loadable/server';
import { parse } from 'node-html-parser';

import React from 'react';
import {renderToString} from 'react-dom/server';

const statsFile = resolve('./dist/loadable-stats.json')

import labs from './src/lab';
import work from './src/work';

import {App} from './src/components/App.js';
import {RouterContext} from "@stilva/transitionable-react-router";

readFile('./dist/index.html', (err, buff) => {
  const parsedTemplate = parse(buff.toString());

  ['/', '/lab', '/work'].forEach(path => writeToFile(parsedTemplate, path));

  getLabs()
    .forEach(path => writeToFile(parsedTemplate, path, true));

  getWorks()
    .forEach(path => writeToFile(parsedTemplate, path, true));
});

function getWorks() {
  return Array
    .from(work.keys())
    .map(slug => `/work/${slug}`);
}

function getLabs() {
  return Array
    .from(labs.keys())
    .map(slug => `/lab/${slug}`);
}

function writeToFile(tpl, path, isEntry = false) {
  const options = {
    entrypoints: ["bundle"],
    statsFile
  };

  const extractor = new ChunkExtractor(options);

  const jsx = extractor.collectChunks(<RouterContext.Provider value={{currentRoute: path}}>
    <App/>
  </RouterContext.Provider>);

  tpl.querySelector('#app').set_content(renderToString(jsx));

  const filename = join(`${path === '/' ? 'index' : path}.html`);

  const folderPattern = /^(\/.+\/)?[^\.]+\.(?:html)$/ig;
  const match = folderPattern.exec(filename);
  const stringified = tpl.toString();

  if (!match) return;

  pMakeDirOrSkip({prefix: './dist', folder: match[1], uri: filename})
    .then(({prefix, folder, uri}) => {
      writeFile(join(prefix, uri), stringified, err => {
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
