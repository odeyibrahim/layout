/* Minimal vector PDF writer: rects, text (Times/Helvetica), paths, JPEG photos. No dependencies. */
const WIN={"—":0x97,"–":0x96,"’":0x92,"‘":0x91,"“":0x93,"”":0x94,"·":0xB7,"×":0xD7,"…":0x85,"•":0x95,"€":0x80};
const enc=s=>{let o="";for(const ch of s){const c=ch.charCodeAt(0),b=WIN[ch]??(c<256?c:63);o+=(b===40||b===41||b===92)?"\\"+String.fromCharCode(b):String.fromCharCode(b)}return o};
const rgb=h=>{const n=parseInt(/^#[0-9a-f]{6}$/i.test(h)?h.slice(1):"000000",16);return[(n>>16)&255,(n>>8)&255,n&255].map(v=>+(v/255).toFixed(3)).join(" ")};
const f=v=>+(+v).toFixed(2);
function jdim(s){let i=2;while(i<s.length-9){if(s.charCodeAt(i)!==255){i++;continue}const m=s.charCodeAt(i+1);if(m>=0xC0&&m<=0xCF&&m!==0xC4&&m!==0xC8&&m!==0xCC)return[s.charCodeAt(i+7)*256+s.charCodeAt(i+8),s.charCodeAt(i+5)*256+s.charCodeAt(i+6)];i+=2+s.charCodeAt(i+2)*256+s.charCodeAt(i+3)}return null}
export function pdfFromPage(p,o){const k=.75,H=p.h*k,W=p.w*k,imgs=[];let c="";
for(const e of p.els){
if(e.t==="rect")c+=`${rgb(o.tok(e.c))} rg ${f(e.x*k)} ${f(H-(e.y+e.h)*k)} ${f(e.w*k)} ${f(e.h*k)} re f\n`;
else if(e.t==="text"){const lh=e.size*1.2;o.wrap(e).forEach((l,i)=>{const w=o.mw(l,e)*k;let x=e.x*k;if(e.al==="c")x=(e.x+e.w/2)*k-w/2;else if(e.al==="r")x=(e.x+e.w)*k-w;c+=`BT /${e.f==="h"?"F1":"F2"} ${f(e.size*k)} Tf ${rgb(o.tok(e.c))} rg ${f(x)} ${f(H-(e.y+e.size+i*lh)*k)} Td (${enc(l)}) Tj ET\n`})}
else if(e.t==="path"&&e.nodes.length){const d=e.nodes,n=d.length,P=(x,y)=>f(x*k)+" "+f(H-y*k);let s=`${P(d[0].x,d[0].y)} m `;for(let i=1;i<(e.closed?n+1:n);i++){const a=d[i-1],b=d[i%n];s+=(a.ox!=null||b.ix!=null)?`${P(a.ox??a.x,a.oy??a.y)} ${P(b.ix??b.x,b.iy??b.y)} ${P(b.x,b.y)} c `:`${P(b.x,b.y)} l `}if(e.closed)s+="h ";c+=`1 J 1 j ${f(e.w*k)} w ${rgb(o.tok(e.c))} RG ${s}S\n`}
else if(e.t==="image"){const m=/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(e.src||"");if(!m)continue;const s=atob(m[1]),dm=jdim(s);if(!dm)continue;imgs.push([s,dm]);const sc=Math.max(e.w/dm[0],e.h/dm[1]),dw=dm[0]*sc,dh=dm[1]*sc,x0=e.x+(e.w-dw)/2,y0=e.y+(e.h-dh)/2;c+=`q ${f(e.x*k)} ${f(H-(e.y+e.h)*k)} ${f(e.w*k)} ${f(e.h*k)} re W n ${f(dw*k)} 0 0 ${f(dh*k)} ${f(x0*k)} ${f(H-(y0+dh)*k)} cm /Im${imgs.length} Do Q\n`}}
const ob=[];ob[1]="<</Type/Catalog/Pages 2 0 R>>";ob[2]="<</Type/Pages/Kids[3 0 R]/Count 1>>";
ob[3]=`<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${f(W)} ${f(H)}]/Contents 4 0 R/Resources<</Font<</F1 5 0 R/F2 6 0 R>>/XObject<<${imgs.map((_,i)=>`/Im${i+1} ${7+i} 0 R`).join(" ")}>>>>>>`;
ob[4]=`<</Length ${c.length}>>\nstream\n${c}\nendstream`;
ob[5]="<</Type/Font/Subtype/Type1/BaseFont/Times-Roman/Encoding/WinAnsiEncoding>>";ob[6]="<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>";
imgs.forEach(([s,d],i)=>{ob[7+i]=`<</Type/XObject/Subtype/Image/Width ${d[0]}/Height ${d[1]}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${s.length}>>\nstream\n${s}\nendstream`});
let out="%PDF-1.4\n";const off=[];for(let i=1;i<ob.length;i++){off[i]=out.length;out+=`${i} 0 obj\n${ob[i]}\nendobj\n`}
const x=out.length;out+=`xref\n0 ${ob.length}\n0000000000 65535 f \n`+off.slice(1).map(v=>String(v).padStart(10,"0")+" 00000 n \n").join("")+`trailer\n<</Size ${ob.length}/Root 1 0 R>>\nstartxref\n${x}\n%%EOF`;
return Uint8Array.from(out,ch=>ch.charCodeAt(0)&255)}
