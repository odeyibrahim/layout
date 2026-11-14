import {pathD,rdp,smooth,scaleEl} from "./geom.js";
(function(){
"use strict";
var $=function(s){return document.querySelector(s)},KEY="brandstudio.v1";
var FH="Georgia,'Times New Roman',serif",FB="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
var uid=function(){return Math.random().toString(36).slice(2,9)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var hex=function(c){return/^#[0-9a-f]{6}$/i.test(c)?c:"#000000"};
var D={brand:{name:"Your Brand",tag:"Made with care",primary:"#1f4d3a",accent:"#e0a63a",ink:"#171612",paper:"#f4f1ea"},pages:[],cur:0};
var U=[],R=[],sel=null,mode="sel",tool="pen",pen=null,br=null,dc={col:"ink",w:6},drag=null;
function tok(c){var b=D.brand;return b[c]||hex(c)}
function toast(m){var t=$("#t");t.textContent=m;t.className="o";clearTimeout(toast.h);toast.h=setTimeout(function(){t.className=""},2200)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){toast("Storage is full: share or delete pages")}}
function snap(){U.push(JSON.stringify(D));if(U.length>100)U.shift();R=[]}
function restore(s){D=JSON.parse(s);if(sel&&!pg().els.some(function(e){return e.id===sel}))sel=null}
function pg(){return D.pages[D.cur]}
function el(id){return pg().els.filter(function(e){return e.id===id})[0]}
function T(x,y,w,size,text,c,o){return Object.assign({id:uid(),t:"text",x:x,y:y,w:w,size:size,text:text,c:c,f:"h",al:"l"},o||{})}
function Rc(x,y,w,h,c){return{id:uid(),t:"rect",x:x,y:y,w:w,h:h,c:c}}
var JOBS={
post:{n:"Post",w:1080,h:1080,mk:function(b){return[Rc(0,0,1080,1080,"primary"),Rc(80,80,120,10,"accent"),T(80,140,920,40,b.name.toUpperCase(),"accent",{f:"b"}),T(80,380,920,120,"Say it with care.","paper"),T(80,940,920,36,b.tag,"paper",{f:"b"})]}},
story:{n:"Story",w:1080,h:1920,mk:function(b){return[Rc(0,0,1080,1920,"paper"),Rc(0,0,1080,720,"primary"),T(80,300,920,44,b.name.toUpperCase(),"accent",{f:"b"}),T(80,860,920,110,"Now open.","ink"),T(80,1500,920,40,"Tap to find out more",  "primary",{f:"b"})]}},
quote:{n:"Quote",w:1080,h:1350,mk:function(b){return[Rc(0,0,1080,1350,"paper"),Rc(80,160,10,520,"accent"),T(130,160,820,76,"A short line your customers will remember.","ink"),T(130,1150,820,36,"— "+b.name,"primary",{f:"b"})]}},
flyer:{n:"Flyer",w:794,h:1123,mk:function(b){return[Rc(0,0,794,1123,"paper"),Rc(0,0,794,420,"primary"),T(60,120,674,40,b.name.toUpperCase(),"accent",{f:"b"}),T(60,200,674,110,"Big news.","paper"),T(60,520,674,40,"Date · Time · Place","ink",{f:"b"}),T(60,1030,674,26,b.tag,"primary",{f:"b"})]}},
card:{n:"Business card",w:1050,h:600,mk:function(b){return[Rc(0,0,1050,600,"primary"),T(70,90,900,60,b.name,"paper"),T(70,470,900,34,"Your name · phone · email","accent",{f:"b"})]}},
email:{n:"Email header",w:1200,h:400,mk:function(b){return[Rc(0,0,1200,400,"primary"),T(70,120,1060,80,b.name,"paper"),T(70,290,1060,34,b.tag,"accent",{f:"b"})]}},
menu:{n:"Menu",w:794,h:1123,mk:function(b){return[Rc(0,0,794,1123,"paper"),T(60,90,674,70,"Menu","ink"),Rc(60,190,120,6,"accent"),T(60,250,674,26,"Item one — 0.00","ink",{f:"b"}),T(60,310,674,26,"Item two — 0.00","ink",{f:"b"}),T(60,370,674,26,"Item three — 0.00","ink",{f:"b"}),T(60,1020,674,22,b.name,"primary",{f:"b"})]}},
invoice:{n:"Invoice",w:794,h:1123,mk:function(b){return[Rc(0,0,794,1123,"paper"),T(60,90,400,40,b.name,"primary"),T(60,260,400,56,"INVOICE","ink"),T(60,380,674,24,"Description                                  Qty        Amount","ink",{f:"b"}),Rc(60,412,674,2,"ink"),T(60,430,674,24,"Item one","ink",{f:"b"}),T(60,1020,674,22,b.tag,"primary",{f:"b"})]}}
};
function newPage(k){var j=JOBS[k];return{id:uid(),job:k,name:j.n,w:j.w,h:j.h,els:j.mk(D.brand)}}
function load(){try{var s=localStorage.getItem(KEY);if(s){var d=JSON.parse(s);if(d&&d.pages&&d.pages.length&&d.brand){D=d;return}}}catch(e){}D.pages=[newPage("post")]}
var cx=document.createElement("canvas").getContext("2d");
function wrap(e){var f=(e.f==="h"?FH:FB);cx.font=e.size+"px "+f;var out=[];String(e.text).split("\n").forEach(function(p){var ws=p.split(/\s+/),l="";ws.forEach(function(w){var n=l?l+" "+w:w;if(cx.measureText(n).width>e.w&&l){out.push(l);l=w}else l=n});out.push(l)});return out}
function imgSvg(e,a){var u=String(e.src).replace(/[^A-Za-z0-9+\/=:;,]/g,""),r=' x="'+e.x+'" y="'+e.y+'" width="'+e.w+'" height="'+e.h+'"';return'<g'+a+'><svg'+r+' overflow="hidden"><image href="'+u+'" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="filter:brightness('+(+e.br||100)+'%) contrast('+(+e.co||100)+'%) saturate('+(+e.sa||100)+'%)"/></svg><rect'+r+' fill="transparent"/></g>'}
function svg(p,ui){var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+p.w+" "+p.h+'" width="'+p.w+'" height="'+p.h+'">',els=p.els.slice();if(ui&&pen)els.push(pen.el);
els.forEach(function(e,k){var a=ui?' data-i="'+e.id+'"':"";
if(e.t==="image")s+=imgSvg(e,a);else if(e.t==="rect")s+='<rect'+a+' x="'+e.x+'" y="'+e.y+'" width="'+e.w+'" height="'+e.h+'" fill="'+tok(e.c)+'"/>';
else if(e.t==="text"){var L=wrap(e),lh=e.size*1.2,ax=e.al==="c"?e.x+e.w/2:e.al==="r"?e.x+e.w:e.x,an=e.al==="c"?"middle":e.al==="r"?"end":"start";s+='<text'+a+' font-size="'+e.size+'" fill="'+tok(e.c)+'" font-family="'+(e.f==="h"?FH:FB)+'" text-anchor="'+an+'">';L.forEach(function(l,i){s+='<tspan x="'+ax+'" y="'+(e.y+e.size+i*lh)+'">'+esc(l)+"</tspan>"});s+="</text>"}
else if(e.t==="path")s+='<path'+a+' d="'+pathD(e.nodes,e.closed)+'" fill="'+(e.fill?tok(e.fill):"none")+'" stroke="'+tok(e.c)+'" stroke-width="'+e.w+'" stroke-linecap="round" stroke-linejoin="round" opacity="'+(e.op||1)+'"/>'});
if(ui&&sel&&mode==="sel"){s+='<g id="so" pointer-events="none"></g>'}
if(ui&&pen){pen.el.nodes.forEach(function(n){s+='<circle cx="'+n.x+'" cy="'+n.y+'" r="'+p.w/90+'" fill="#fff" stroke="#e0431a" stroke-width="'+p.w/360+'" pointer-events="none"/>'})}
return s+"</svg>"}
function render(k){var p=pg(),st=$("#st");st.className=mode==="draw"?"dr":"";st.innerHTML=svg(p,1);
var o=$("#so");if(o&&sel){var n=st.querySelector('[data-i="'+sel+'"]');if(n){var b=n.getBBox(),q=p.w/200;o.innerHTML='<rect x="'+(b.x-q)+'" y="'+(b.y-q)+'" width="'+(b.width+2*q)+'" height="'+(b.height+2*q)+'" fill="none" stroke="#e0431a" stroke-width="'+q/1.5+'" stroke-dasharray="'+q*2+'"/>'}}
$("#ti").textContent=D.brand.name+" · "+p.name;$("#un").disabled=!U.length;$("#re").disabled=!R.length;if(!k)ctx();save()}
function swatches(cur,fn,cls){var h="";["primary","accent","ink","paper"].forEach(function(k){h+='<button class="sw'+(cur===k?" on":"")+'" style="background:'+D.brand[k]+'" data-sw="'+k+'" aria-label="Brand colour '+k+'"></button>'});return h}
function ctx(){var c=$("#ctx"),e=sel&&el(sel),h="";
if(mode==="draw"){h='<button class="b'+(tool==="pen"?" on":"")+'" data-tl="pen">Pen</button><button class="b'+(tool==="brush"?" on":"")+'" data-tl="brush">Brush</button><button class="b'+(tool==="erase"?" on":"")+'" data-tl="erase">Eraser</button>'+swatches(dc.col)+'<input type="range" min="2" max="60" value="'+dc.w+'" id="dw" aria-label="Size" style="min-width:90px">'+(pen?'<button class="b p" id="dn">Done</button>':'')+'<button class="b" id="dx">Exit</button>'}
else if(e&&e.t==="text"){h='<input type="text" id="tx" aria-label="Edit text" value="'+esc(e.text)+'"><button class="b" data-a="s-">A−</button><button class="b" data-a="s+">A+</button><button class="b" data-a="al">Align</button>'+swatches(e.c)+'<button class="b" data-a="del">Delete</button>'}
else if(e&&e.t==="path"){h=swatches(e.c)+'<input type="range" min="2" max="60" value="'+e.w+'" id="pw" aria-label="Stroke width" style="min-width:90px"><button class="b" data-a="del">Delete</button>'}
else if(e&&e.t==="image"){h='<label style="margin:0">Light <input type="range" id="ib" min="50" max="150" value="'+e.br+'"></label><label style="margin:0">Contrast <input type="range" id="ic" min="50" max="150" value="'+e.co+'"></label><label style="margin:0">Colour <input type="range" id="is" min="0" max="200" value="'+e.sa+'"></label><button class="b" data-f="n">Natural</button><button class="b" data-f="m">Mono</button><button class="b" data-f="p">Punchy</button><button class="b" data-a="z-">Smaller</button><button class="b" data-a="z+">Bigger</button><button class="b" data-a="del">Delete</button>'}
else if(e){h=swatches(e.c)+'<button class="b" data-a="del">Delete</button>'}
else h='<button class="b" id="dm">Draw</button><button class="b" id="ad">Add text</button><button class="b" id="ph2">Photo</button><button class="b" id="rz">Resize</button><span style="color:var(--mu);font-size:13px">Tap anything to edit it</span>';
c.innerHTML=h}
function sheet(n){var s=$("#sh"),h="";document.querySelectorAll("nav button").forEach(function(b){b.className=b.dataset.n===n?"on":""});
if(!n){s.className="";return}
if(n==="c"){h='<b>What do you need?</b><div class="g" style="margin-top:10px">';Object.keys(JOBS).forEach(function(k){h+='<button class="b" data-job="'+k+'"><b>'+JOBS[k].n+'</b><br><small style="color:var(--mu)">'+JOBS[k].w+"×"+JOBS[k].h+"</small></button>"});h+="</div>"}
if(n==="b"){var b=D.brand;h='<b>Your brand</b><label for="bn">Name</label><input type="text" id="bn" value="'+esc(b.name)+'"><label for="bt">Tagline</label><input type="text" id="bt" value="'+esc(b.tag)+'">';["primary","accent","ink","paper"].forEach(function(k){h+='<label for="c_'+k+'">'+k[0].toUpperCase()+k.slice(1)+'</label><div class="r"><input type="color" id="c_'+k+'" data-bc="'+k+'" value="'+b[k]+'"></div>'});h+='<p style="color:var(--mu);font-size:13px">Colours and names update every page that uses them.</p>'}
if(n==="r"){h='<b>Resize this design</b><p style="color:var(--mu);font-size:13px;margin:6px 0">Makes a copy in the new format. Your original stays.</p><div class="g">';Object.keys(JOBS).forEach(function(k){h+='<button class="b" data-rs="'+k+'"><b>'+JOBS[k].n+'</b><br><small style="color:var(--mu)">'+JOBS[k].w+"×"+JOBS[k].h+"</small></button>"});h+="</div>"}
if(n==="p"){h='<b>Pages</b>';D.pages.forEach(function(p,i){h+='<div class="pg"><span>'+esc(p.name)+(i===D.cur?" (open)":"")+'</span><button class="b" data-go="'+i+'">Open</button><button class="b" data-dup="'+i+'">Copy</button><button class="b" data-rm="'+i+'"'+(D.pages.length<2?" disabled":"")+'>Delete</button></div>'})}
if(n==="s"){h='<b>Share this page</b><div class="g" style="margin-top:10px"><button class="b p" id="shr">Share…</button><button class="b" id="png">Save PNG</button></div><p style="color:var(--mu);font-size:13px">Everything stays on this device.</p>'}
s.innerHTML=h;s.className="o";s.dataset.n=n}
function pt(ev){var sv=$("#st svg"),q=sv.createSVGPoint();q.x=ev.clientX;q.y=ev.clientY;var m=q.matrixTransform(sv.getScreenCTM().inverse());return{x:Math.round(m.x*10)/10,y:Math.round(m.y*10)/10}}
function addPath(nodes,closed){if(nodes.length<2)return;snap();var e={id:uid(),t:"path",nodes:nodes,closed:!!closed,fill:null,c:dc.col,w:dc.w,op:1};pg().els.push(e);sel=null;render()}
function done(){if(pen&&pen.el.nodes.length>1)addPath(pen.el.nodes,false);pen=null;render()}
var st=$("#st");
st.addEventListener("pointerdown",function(ev){var p=pg(),q=pt(ev);
if(mode==="draw"){ev.preventDefault();st.setPointerCapture(ev.pointerId);
if(tool==="erase"){var h=ev.target.closest("[data-i]");if(h&&el(h.dataset.i)&&el(h.dataset.i).t==="path"){snap();p.els=p.els.filter(function(e){return e.id!==h.dataset.i});render()}return}
if(tool==="brush"){br=[q];return}
if(!pen)pen={el:{id:"pen",t:"path",nodes:[],closed:false,fill:null,c:dc.col,w:dc.w,op:1}};var ns=pen.el.nodes;
if(ns.length>2&&Math.hypot(ns[0].x-q.x,ns[0].y-q.y)<p.w/25){addPath(ns,true);pen=null;render();return}
ns.push({x:q.x,y:q.y});pen.down=true;render();return}
var h=ev.target.closest("[data-i]");sel=h?h.dataset.i:null;drag=null;
if(sel){var e=el(sel);if(e&&e.t!=="path"){drag={sx:q.x,sy:q.y,ox:e.x,oy:e.y,s:0};st.setPointerCapture(ev.pointerId)}}
render()});
st.addEventListener("pointermove",function(ev){var q=pt(ev);
if(mode==="draw"){if(br&&tool==="brush"){var l=br[br.length-1];if(Math.hypot(l.x-q.x,l.y-q.y)>2){br.push(q);var pp=$("#st svg");var t=pp.querySelector("#bp");if(!t){t=document.createElementNS("http://www.w3.org/2000/svg","path");t.id="bp";t.setAttribute("fill","none");t.setAttribute("stroke-linecap","round");t.setAttribute("stroke-linejoin","round");pp.appendChild(t)}t.setAttribute("stroke",tok(dc.col));t.setAttribute("stroke-width",dc.w);t.setAttribute("d",pathD(br,false))}return}
if(pen&&pen.down){var n=pen.el.nodes[pen.el.nodes.length-1];if(Math.hypot(q.x-n.x,q.y-n.y)>6){n.ox=q.x;n.oy=q.y;n.ix=2*n.x-q.x;n.iy=2*n.y-q.y;var d=$("#st svg");render()}}return}
if(drag){if(!drag.s){if(Math.hypot(q.x-drag.sx,q.y-drag.sy)<6)return;snap();drag.s=1}var e=el(sel);e.x=Math.round(drag.ox+q.x-drag.sx);e.y=Math.round(drag.oy+q.y-drag.sy);render()}});
function up(){if(br){var s=rdp(br,Math.max(1.5,dc.w*.35));if(br.length===1)s=[br[0],{x:br[0].x+.1,y:br[0].y}];addPath(smooth(s),false);br=null}if(pen)pen.down=false;drag=null}
st.addEventListener("pointerup",up);st.addEventListener("pointercancel",function(){br=null;if(pen)pen.down=false;drag=null;render()});
$("#ctx").addEventListener("click",function(ev){var b=ev.target.closest("button");if(!b)return;var e=sel&&el(sel);
if(b.dataset.sw){if(mode==="draw")dc.col=b.dataset.sw;else if(e){snap();e.c=b.dataset.sw}render();return}
if(b.dataset.tl){if(pen)done();tool=b.dataset.tl;render();return}
if(b.id==="dm"){mode="draw";sel=null;render();return}if(b.id==="dx"){if(pen)done();mode="sel";render();return}if(b.id==="dn"){done();return}
if(b.id==="ph2"){$("#ph").click();return}if(b.id==="rz"){sheet("r");return}
if(b.id==="ad"){snap();var t=T(80,Math.round(pg().h/2),pg().w-160,56,"New text","ink");pg().els.push(t);sel=t.id;render();return}
if(b.dataset.f&&e&&e.t==="image"){snap();var F={n:[100,100,100],m:[100,110,0],p:[105,125,140]}[b.dataset.f];e.br=F[0];e.co=F[1];e.sa=F[2];render();return}
var a=b.dataset.a;if(!a||!e)return;snap();
if(a==="del"){pg().els=pg().els.filter(function(x){return x.id!==sel});sel=null}
if(a==="s+")e.size=Math.min(300,Math.round(e.size*1.12));if(a==="s-")e.size=Math.max(10,Math.round(e.size/1.12));
if(a==="z+"||a==="z-"){var m=a==="z+"?1.1:1/1.1;e.x=Math.round(e.x+e.w*(1-m)/2);e.y=Math.round(e.y+e.h*(1-m)/2);e.w=Math.round(e.w*m);e.h=Math.round(e.h*m)}if(a==="al")e.al=e.al==="l"?"c":e.al==="c"?"r":"l";render()});
$("#ctx").addEventListener("input",function(ev){var t=ev.target,e=sel&&el(sel);
if(t.id==="dw"){dc.w=+t.value;if(pen)pen.el.w=dc.w;return}
var IM={ib:"br",ic:"co",is:"sa"};if(IM[t.id]&&sel&&el(sel)){var q=el(sel);if(!q._s){snap();q._s=1}q[IM[t.id]]=+t.value;render(1);return}
if(!e)return;if(t.id==="tx"){if(!e._s){snap();e._s=1}e.text=t.value;render();var i=$("#tx");i.focus();i.setSelectionRange(1e4,1e4)}
if(t.id==="pw"){if(!e._s){snap();e._s=1}e.w=+t.value;render(1)}});
$("#ctx").addEventListener("change",function(){var e=sel&&el(sel);if(e)delete e._s});
function nm(s){return String(s).slice(0,60)}
$("#sh").addEventListener("input",function(ev){var t=ev.target;if(t.id==="bn"||t.id==="bt"||t.dataset.bc){snap();if(t.id==="bn")D.brand.name=nm(t.value)||"Your Brand";else if(t.id==="bt")D.brand.tag=nm(t.value);else D.brand[t.dataset.bc]=hex(t.value);render()}});
$("#sh").addEventListener("click",function(ev){var b=ev.target.closest("button");if(!b)return;
if(b.dataset.rs){snap();var j=JOBS[b.dataset.rs],p0=pg(),sx=j.w/p0.w,sy=j.h/p0.h;D.pages.push({id:uid(),job:b.dataset.rs,name:j.n+" from "+p0.name,w:j.w,h:j.h,els:p0.els.map(function(e){var n=scaleEl(e,sx,sy);n.id=uid();return n})});D.cur=D.pages.length-1;sel=null;sheet(null);render();toast("Resized to "+j.n);return}
if(b.dataset.job){snap();D.pages.push(newPage(b.dataset.job));D.cur=D.pages.length-1;sel=null;mode="sel";sheet(null);render();return}
if(b.dataset.go){D.cur=+b.dataset.go;sel=null;sheet(null);render();return}
if(b.dataset.dup){snap();var c=JSON.parse(JSON.stringify(D.pages[+b.dataset.dup]));c.id=uid();c.name+=" copy";c.els.forEach(function(e){e.id=uid()});D.pages.splice(+b.dataset.dup+1,0,c);sheet("p");render();return}
if(b.dataset.rm&&D.pages.length>1){snap();D.pages.splice(+b.dataset.rm,1);D.cur=Math.min(D.cur,D.pages.length-1);sel=null;sheet("p");render();return}
if(b.id==="png")exportPng(0);if(b.id==="shr")exportPng(1)});
function exportPng(share){var p=pg(),s=svg(p,0),im=new Image(),u=URL.createObjectURL(new Blob([s],{type:"image/svg+xml"}));
im.onload=function(){var c=document.createElement("canvas");c.width=p.w;c.height=p.h;c.getContext("2d").drawImage(im,0,0);URL.revokeObjectURL(u);c.toBlob(function(bl){if(!bl)return toast("Could not make the image");var fn=(D.brand.name+"-"+p.name).replace(/[^\w-]+/g,"-")+".png";
if(share&&navigator.canShare&&navigator.share){var f=new File([bl],fn,{type:"image/png"});if(navigator.canShare({files:[f]})){navigator.share({files:[f]}).catch(function(){});return}}
var a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download=fn;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000)},"image/png")};
im.onerror=function(){toast("Could not make the image")};im.src=u}
$("#un").onclick=function(){if(!U.length)return;R.push(JSON.stringify(D));restore(U.pop());pen=null;render()};
$("#re").onclick=function(){if(!R.length)return;U.push(JSON.stringify(D));restore(R.pop());render()};
$("#sd").onclick=function(){sheet("s")};
document.querySelectorAll("nav button").forEach(function(b){b.onclick=function(){var s=$("#sh");if(s.className==="o"&&s.dataset.n===b.dataset.n)sheet(null);else sheet(b.dataset.n)}});
document.addEventListener("keydown",function(ev){var m=ev.metaKey||ev.ctrlKey;if(m&&ev.key==="z"&&!(ev.target.tagName==="INPUT")){ev.preventDefault();(ev.shiftKey?$("#re"):$("#un")).click()}
if(ev.key==="Enter"&&pen&&!(ev.target.tagName==="INPUT"))done();if(ev.key==="Escape"){if(pen)done();else if(mode==="draw"){mode="sel";render()}else sheet(null)}
if(ev.target.tagName!=="INPUT"&&mode==="sel"&&sel&&(ev.key==="Delete"||ev.key==="Backspace")){snap();pg().els=pg().els.filter(function(x){return x.id!==sel});sel=null;render()}});
$("#ph").addEventListener("change",function(){var f=this.files[0];this.value="";if(!f)return;var im=new Image(),u=URL.createObjectURL(f);im.onload=function(){var k=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);var p=pg(),w=Math.round(p.w*.7),h=Math.round(w*c.height/c.width);snap();var e={id:uid(),t:"image",x:Math.round((p.w-w)/2),y:Math.round((p.h-h)/2),w:w,h:h,src:c.toDataURL("image/jpeg",.85),br:100,co:100,sa:100};p.els.push(e);sel=e.id;render()};im.onerror=function(){toast("That image couldn’t be opened")};im.src=u});
load();render();
if("serviceWorker" in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register("sw.js").catch(function(){});
})();
