/* Pure path geometry (no DOM). Tested in tests/geom.test.js */
export function pathD(nodes,closed){if(!nodes.length)return"";var d="M"+nodes[0].x+" "+nodes[0].y,n=nodes.length,i,a,b;for(i=1;i<(closed?n+1:n);i++){a=nodes[i-1];b=nodes[i%n];d+=(a.ox!=null||b.ix!=null)?"C"+(a.ox!=null?a.ox:a.x)+" "+(a.oy!=null?a.oy:a.y)+" "+(b.ix!=null?b.ix:b.x)+" "+(b.iy!=null?b.iy:b.y)+" "+b.x+" "+b.y:"L"+b.x+" "+b.y}return d+(closed?"Z":"")}
export function rdp(a,e){if(a.length<3)return a;var f=0,mx=0,i,A=a[0],B=a[a.length-1],dx=B.x-A.x,dy=B.y-A.y,l=Math.hypot(dx,dy)||1;for(i=1;i<a.length-1;i++){var d=Math.abs(dy*(a[i].x-A.x)-dx*(a[i].y-A.y))/l;if(d>mx){mx=d;f=i}}return mx>e?rdp(a.slice(0,f+1),e).slice(0,-1).concat(rdp(a.slice(f),e)):[A,B]}
export function smooth(a){return a.map(function(p,i){if(i===0||i===a.length-1)return{x:p.x,y:p.y};var q=a[i-1],n=a[i+1],tx=(n.x-q.x)/6,ty=(n.y-q.y)/6;return{x:p.x,y:p.y,ix:p.x-tx,iy:p.y-ty,ox:p.x+tx,oy:p.y+ty}})}
export function scaleEl(e,sx,sy){var s=Math.min(sx,sy),c=JSON.parse(JSON.stringify(e)),r=function(v){return Math.round(v*10)/10};
if(c.t==="path"){c.nodes=c.nodes.map(function(n){var o={};for(var k in n)o[k]=r(n[k]*(k==="x"||k==="ix"||k==="ox"?sx:sy));return o});c.w=Math.max(1,r(c.w*s));return c}
c.x=r(c.x*sx);c.y=r(c.y*sy);c.w=r(c.w*sx);if(c.t==="rect"||c.t==="image")c.h=r(c.h*sy);if(c.t==="text")c.size=r(c.size*s);return c}
