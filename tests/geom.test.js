import test from "node:test";import assert from "node:assert/strict";
import {pathD,rdp,smooth,scaleEl} from "../public/geom.js";
test("pathD builds lines and closes",()=>{assert.equal(pathD([{x:0,y:0},{x:10,y:0},{x:10,y:10}],true),"M0 0L10 0L10 10L0 0Z");assert.equal(pathD([],false),"")});
test("pathD uses cubic when handles exist",()=>{assert.match(pathD([{x:0,y:0,ox:3,oy:0},{x:10,y:0,ix:7,iy:0}],false),/^M0 0C3 0 7 0 10 0$/)});
test("rdp drops collinear points, keeps corners",()=>{assert.equal(rdp([{x:0,y:0},{x:5,y:0},{x:10,y:0}],1).length,2);assert.equal(rdp([{x:0,y:0},{x:10,y:0},{x:10,y:10}],1).length,3)});
test("smooth keeps endpoints sharp, gives inner points handles",()=>{const s=smooth([{x:0,y:0},{x:5,y:5},{x:10,y:0}]);assert.equal(s[0].ox,undefined);assert.ok(Number.isFinite(s[1].ox)&&Number.isFinite(s[1].ix))});
test("no NaN across 500 random strokes",()=>{for(let i=0;i<500;i++){const p=Array.from({length:2+i%40},()=>({x:Math.random()*1e3,y:Math.random()*1e3}));assert.ok(!/NaN|undefined/.test(pathD(smooth(rdp(p,2)),false)))}});
test("scaleEl scales rects by axis, text by the smaller factor, paths and stroke",()=>{
const r=scaleEl({t:"rect",x:10,y:10,w:100,h:50},2,3);assert.deepEqual([r.x,r.y,r.w,r.h],[20,30,200,150]);
assert.equal(scaleEl({t:"text",x:0,y:0,w:100,size:40},2,3).size,80);
const p=scaleEl({t:"path",w:10,nodes:[{x:1,y:1,ox:2,oy:2}]},2,3);assert.deepEqual(p.nodes[0],{x:2,y:3,ox:4,oy:6});assert.equal(p.w,20)});
