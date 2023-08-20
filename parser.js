// parses information from files
// used code from https://github.com/adrienjoly/npm-pdfreader/discussions/111

import http from 'https'
import fs from 'fs';
import { PdfReader } from "pdfreader/PdfReader.js";
import { Rule } from "pdfreader/Rule.js";

let rows = {}; // indexed by y-position

function flushRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => console.log((rows[y] || []).join("")));
  rows = {}; // clear rows for next page
}

const processItem = Rule.makeItemProcessor([
    Rule.on(/.*/)
        .extractRegexpValues()
        .then((value) => {console.log(value)}),
  ]);

export const parse = async (buffer, msg) => new Promise(resolve => setTimeout(() => {
    new PdfReader({ debug: true }).parseBuffer(buffer, async (err, item) => {
        if (err)  {
            msg.reply('there was an error with parsing file ' + index + ': ' + err);
        }
        else if (!item) {
            flushRows();
            console.log("END OF FILE");
            resolve(); // resolve the promise
        }
        else if (item.page) {
            flushRows(); // print the rows of the previous page
            console.log("PAGE:", item.page);
        } else if (item.text) {
            // accumulate text items into rows object, per line
            (rows[item.y] = rows[item.y] || []).push(item.text);
        }
    });
}, 1))