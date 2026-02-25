import{r as N,j as l,R as h,f as y}from"./app-DzK1gbCK.js";import{C as T}from"./JsonView-DB6OvlW2.js";import{_ as M,a as d,c as z,b as i,n as A,o as U}from"./createTheme-C3PDnj56.js";import{u as O}from"./useTheme-BadDaQPl.js";import{a as E,b as K,e as W,s as C,c as X}from"./styled-DmLGLTNf.js";import{c as k,k as $}from"./emotion-react.browser.esm-DYW1Qt72.js";function F(r){return E("MuiLinearProgress",r)}K("MuiLinearProgress",["root","colorPrimary","colorSecondary","determinate","indeterminate","buffer","query","dashed","dashedColorPrimary","dashedColorSecondary","bar","barColorPrimary","barColorSecondary","bar1Indeterminate","bar1Determinate","bar1Buffer","bar2Indeterminate","bar2Buffer"]);const J=["className","color","value","valueBuffer","variant"];let m=r=>r,B,I,_,j,q,D;const P=4,V=$(B||(B=m`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`)),G=$(I||(I=m`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`)),H=$(_||(_=m`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`)),Q=r=>{const{classes:e,variant:a,color:o}=r,u={root:["root",`color${i(o)}`,a],dashed:["dashed",`dashedColor${i(o)}`],bar1:["bar",`barColor${i(o)}`,(a==="indeterminate"||a==="query")&&"bar1Indeterminate",a==="determinate"&&"bar1Determinate",a==="buffer"&&"bar1Buffer"],bar2:["bar",a!=="buffer"&&`barColor${i(o)}`,a==="buffer"&&`color${i(o)}`,(a==="indeterminate"||a==="query")&&"bar2Indeterminate",a==="buffer"&&"bar2Buffer"]};return X(u,F,e)},L=(r,e)=>e==="inherit"?"currentColor":r.vars?r.vars.palette.LinearProgress[`${e}Bg`]:r.palette.mode==="light"?A(r.palette[e].main,.62):U(r.palette[e].main,.5),Y=C("span",{name:"MuiLinearProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.root,e[`color${i(a.color)}`],e[a.variant]]}})(({ownerState:r,theme:e})=>d({position:"relative",overflow:"hidden",display:"block",height:4,zIndex:0,"@media print":{colorAdjust:"exact"},backgroundColor:L(e,r.color)},r.color==="inherit"&&r.variant!=="buffer"&&{backgroundColor:"none","&::before":{content:'""',position:"absolute",left:0,top:0,right:0,bottom:0,backgroundColor:"currentColor",opacity:.3}},r.variant==="buffer"&&{backgroundColor:"transparent"},r.variant==="query"&&{transform:"rotate(180deg)"})),Z=C("span",{name:"MuiLinearProgress",slot:"Dashed",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.dashed,e[`dashedColor${i(a.color)}`]]}})(({ownerState:r,theme:e})=>{const a=L(e,r.color);return d({position:"absolute",marginTop:0,height:"100%",width:"100%"},r.color==="inherit"&&{opacity:.3},{backgroundImage:`radial-gradient(${a} 0%, ${a} 16%, transparent 42%)`,backgroundSize:"10px 10px",backgroundPosition:"0 -23px"})},k(j||(j=m`
    animation: ${0} 3s infinite linear;
  `),H)),w=C("span",{name:"MuiLinearProgress",slot:"Bar1",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.bar,e[`barColor${i(a.color)}`],(a.variant==="indeterminate"||a.variant==="query")&&e.bar1Indeterminate,a.variant==="determinate"&&e.bar1Determinate,a.variant==="buffer"&&e.bar1Buffer]}})(({ownerState:r,theme:e})=>d({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",backgroundColor:r.color==="inherit"?"currentColor":(e.vars||e).palette[r.color].main},r.variant==="determinate"&&{transition:`transform .${P}s linear`},r.variant==="buffer"&&{zIndex:1,transition:`transform .${P}s linear`}),({ownerState:r})=>(r.variant==="indeterminate"||r.variant==="query")&&k(q||(q=m`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `),V)),S=C("span",{name:"MuiLinearProgress",slot:"Bar2",overridesResolver:(r,e)=>{const{ownerState:a}=r;return[e.bar,e[`barColor${i(a.color)}`],(a.variant==="indeterminate"||a.variant==="query")&&e.bar2Indeterminate,a.variant==="buffer"&&e.bar2Buffer]}})(({ownerState:r,theme:e})=>d({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left"},r.variant!=="buffer"&&{backgroundColor:r.color==="inherit"?"currentColor":(e.vars||e).palette[r.color].main},r.color==="inherit"&&{opacity:.3},r.variant==="buffer"&&{backgroundColor:L(e,r.color),transition:`transform .${P}s linear`}),({ownerState:r})=>(r.variant==="indeterminate"||r.variant==="query")&&k(D||(D=m`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `),G)),rr=N.forwardRef(function(e,a){const o=W({props:e,name:"MuiLinearProgress"}),{className:u,color:R="primary",value:b,valueBuffer:p,variant:s="indeterminate"}=o,x=M(o,J),t=d({},o,{color:R,variant:s}),f=Q(t),n=O(),g={},v={bar1:{},bar2:{}};if((s==="determinate"||s==="buffer")&&b!==void 0){g["aria-valuenow"]=Math.round(b),g["aria-valuemin"]=0,g["aria-valuemax"]=100;let c=b-100;n.direction==="rtl"&&(c=-c),v.bar1.transform=`translateX(${c}%)`}if(s==="buffer"&&p!==void 0){let c=(p||0)-100;n.direction==="rtl"&&(c=-c),v.bar2.transform=`translateX(${c}%)`}return l.jsxs(Y,d({className:z(f.root,u),ownerState:t,role:"progressbar"},g,{ref:a},x,{children:[s==="buffer"?l.jsx(Z,{className:f.dashed,ownerState:t}):null,l.jsx(w,{className:f.bar1,ownerState:t,style:v.bar1}),s==="determinate"?null:l.jsx(S,{className:f.bar2,ownerState:t,style:v.bar2})]}))});function sr({method:r="post",routeName:e,params:a,after:o,afterCallback:u,...R}){const[b,p]=h.useState(!0),[s,x]=h.useState(null),t=h.useRef(null);typeof o!="function"&&(o=n=>l.jsx(T,{src:n}));const f=({data:n})=>{x(n),p(!1),typeof u=="function"&&u(n)};return h.useEffect(()=>(t.current=y.CancelToken.source(),y[r](route(e,a),{cancelToken:t.current.token}).then(f).catch(n=>{y.isCancel(n)&&console.log("Request canceled",n.message)}),()=>{t.current&&t.current.cancel("Component unmounted")}),[]),b?l.jsx(rr,{}):l.jsx(l.Fragment,{children:o(s)})}export{sr as A,rr as L};
