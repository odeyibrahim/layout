import test from "node:test";import assert from "node:assert/strict";import {pdfFromPage} from "../public/pdf.js";
const o={tok:c=>c==="primary"?"#1f4d3a":"#000000",wrap:e=>String(e.text).split("\n"),mw:(l,e)=>l.length*e.size*.5};
test("pdf has header, trailer and a correct xref offset",()=>{const p={w:794,h:1123,els:[{t:"rect",x:0,y:0,w:794,h:300,c:"primary"},{t:"text",x:60,y:100,w:600,size:40,text:"Hello (world) — ok",c:"ink",f:"h",al:"c"},{t:"path",w:6,c:"ink",closed:false,nodes:[{x:1,y:1,ox:5,oy:5},{x:20,y:20}]}]};
const b=Buffer.from(pdfFromPage(p,o)),s=b.toString("latin1");assert.ok(s.startsWith("%PDF-1.4"));assert.ok(s.trimEnd().endsWith("%%EOF"));
const x=+/startxref\n(\d+)/.exec(s)[1];assert.equal(s.slice(x,x+4),"xref");assert.match(s,/Hello \\\(world\\\) \x97 ok/)});
