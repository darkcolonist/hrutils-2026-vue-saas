import{a as A,_ as ee,c as C}from"./createTheme-C3PDnj56.js";import{r as a,R as W,j as N}from"./app-DzK1gbCK.js";import{b as me,e as be,s as te,a as Ie,c as Ue}from"./styled-DmLGLTNf.js";import{_ as _e}from"./assertThisInitialized-B9jnkVVz.js";import{a as ze}from"./inheritsLoose-B8YXPC31.js";import{T as ue}from"./TransitionGroupContext-Mvz6PzCh.js";import{k as ne}from"./emotion-react.browser.esm-DYW1Qt72.js";import{b as ce,e as H}from"./createSvgIcon-DGBPCsNV.js";import{u as Oe}from"./useIsFocusVisible-Bb7ccel6.js";function oe(e,r){var s=function(t){return r&&a.isValidElement(t)?r(t):t},l=Object.create(null);return e&&a.Children.map(e,function(n){return n}).forEach(function(n){l[n.key]=s(n)}),l}function Ke(e,r){e=e||{},r=r||{};function s(d){return d in r?r[d]:e[d]}var l=Object.create(null),n=[];for(var t in e)t in r?n.length&&(l[t]=n,n=[]):n.push(t);var o,c={};for(var u in r){if(l[u])for(o=0;o<l[u].length;o++){var p=l[u][o];c[l[u][o]]=s(p)}c[u]=s(u)}for(o=0;o<n.length;o++)c[n[o]]=s(n[o]);return c}function F(e,r,s){return s[r]!=null?s[r]:e.props[r]}function Ae(e,r){return oe(e.children,function(s){return a.cloneElement(s,{onExited:r.bind(null,s),in:!0,appear:F(s,"appear",e),enter:F(s,"enter",e),exit:F(s,"exit",e)})})}function Xe(e,r,s){var l=oe(e.children),n=Ke(r,l);return Object.keys(n).forEach(function(t){var o=n[t];if(a.isValidElement(o)){var c=t in r,u=t in l,p=r[t],d=a.isValidElement(p)&&!p.props.in;u&&(!c||d)?n[t]=a.cloneElement(o,{onExited:s.bind(null,o),in:!0,exit:F(o,"exit",e),enter:F(o,"enter",e)}):!u&&c&&!d?n[t]=a.cloneElement(o,{in:!1}):u&&c&&a.isValidElement(p)&&(n[t]=a.cloneElement(o,{onExited:s.bind(null,o),in:p.props.in,exit:F(o,"exit",e),enter:F(o,"enter",e)}))}}),n}var Ye=Object.values||function(e){return Object.keys(e).map(function(r){return e[r]})},We={component:"div",childFactory:function(r){return r}},ie=function(e){ze(r,e);function r(l,n){var t;t=e.call(this,l,n)||this;var o=t.handleExited.bind(_e(t));return t.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},t}var s=r.prototype;return s.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},s.componentWillUnmount=function(){this.mounted=!1},r.getDerivedStateFromProps=function(n,t){var o=t.children,c=t.handleExited,u=t.firstRender;return{children:u?Ae(n,c):Xe(n,o,c),firstRender:!1}},s.handleExited=function(n,t){var o=oe(this.props.children);n.key in o||(n.props.onExited&&n.props.onExited(t),this.mounted&&this.setState(function(c){var u=A({},c.children);return delete u[n.key],{children:u}}))},s.render=function(){var n=this.props,t=n.component,o=n.childFactory,c=ee(n,["component","childFactory"]),u=this.state.contextValue,p=Ye(this.state.children).map(o);return delete c.appear,delete c.enter,delete c.exit,t===null?W.createElement(ue.Provider,{value:u},p):W.createElement(ue.Provider,{value:u},W.createElement(t,c,p))},r}(W.Component);ie.propTypes={};ie.defaultProps=We;function He(e){const{className:r,classes:s,pulsate:l=!1,rippleX:n,rippleY:t,rippleSize:o,in:c,onExited:u,timeout:p}=e,[d,g]=a.useState(!1),b=C(r,s.ripple,s.rippleVisible,l&&s.ripplePulsate),E={width:o,height:o,top:-(o/2)+t,left:-(o/2)+n},h=C(s.child,d&&s.childLeaving,l&&s.childPulsate);return!c&&!d&&g(!0),a.useEffect(()=>{if(!c&&u!=null){const R=setTimeout(u,p);return()=>{clearTimeout(R)}}},[u,c,p]),N.jsx("span",{className:b,style:E,children:N.jsx("span",{className:h})})}const m=me("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),Ge=["center","classes","className"];let G=e=>e,pe,fe,de,he;const Z=550,qe=80,Je=ne(pe||(pe=G`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)),Qe=ne(fe||(fe=G`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)),Ze=ne(de||(de=G`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)),et=te("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),tt=te(He,{name:"MuiTouchRipple",slot:"Ripple"})(he||(he=G`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`),m.rippleVisible,Je,Z,({theme:e})=>e.transitions.easing.easeInOut,m.ripplePulsate,({theme:e})=>e.transitions.duration.shorter,m.child,m.childLeaving,Qe,Z,({theme:e})=>e.transitions.easing.easeInOut,m.childPulsate,Ze,({theme:e})=>e.transitions.easing.easeInOut),nt=a.forwardRef(function(r,s){const l=be({props:r,name:"MuiTouchRipple"}),{center:n=!1,classes:t={},className:o}=l,c=ee(l,Ge),[u,p]=a.useState([]),d=a.useRef(0),g=a.useRef(null);a.useEffect(()=>{g.current&&(g.current(),g.current=null)},[u]);const b=a.useRef(!1),E=a.useRef(0),h=a.useRef(null),R=a.useRef(null);a.useEffect(()=>()=>{E.current&&clearTimeout(E.current)},[]);const U=a.useCallback(f=>{const{pulsate:M,rippleX:x,rippleY:S,rippleSize:I,cb:z}=f;p(T=>[...T,N.jsx(tt,{classes:{ripple:C(t.ripple,m.ripple),rippleVisible:C(t.rippleVisible,m.rippleVisible),ripplePulsate:C(t.ripplePulsate,m.ripplePulsate),child:C(t.child,m.child),childLeaving:C(t.childLeaving,m.childLeaving),childPulsate:C(t.childPulsate,m.childPulsate)},timeout:Z,pulsate:M,rippleX:x,rippleY:S,rippleSize:I},d.current)]),d.current+=1,g.current=z},[t]),$=a.useCallback((f={},M={},x=()=>{})=>{const{pulsate:S=!1,center:I=n||M.pulsate,fakeElement:z=!1}=M;if((f==null?void 0:f.type)==="mousedown"&&b.current){b.current=!1;return}(f==null?void 0:f.type)==="touchstart"&&(b.current=!0);const T=z?null:R.current,B=T?T.getBoundingClientRect():{width:0,height:0,left:0,top:0};let v,D,L;if(I||f===void 0||f.clientX===0&&f.clientY===0||!f.clientX&&!f.touches)v=Math.round(B.width/2),D=Math.round(B.height/2);else{const{clientX:k,clientY:V}=f.touches&&f.touches.length>0?f.touches[0]:f;v=Math.round(k-B.left),D=Math.round(V-B.top)}if(I)L=Math.sqrt((2*B.width**2+B.height**2)/3),L%2===0&&(L+=1);else{const k=Math.max(Math.abs((T?T.clientWidth:0)-v),v)*2+2,V=Math.max(Math.abs((T?T.clientHeight:0)-D),D)*2+2;L=Math.sqrt(k**2+V**2)}f!=null&&f.touches?h.current===null&&(h.current=()=>{U({pulsate:S,rippleX:v,rippleY:D,rippleSize:L,cb:x})},E.current=setTimeout(()=>{h.current&&(h.current(),h.current=null)},qe)):U({pulsate:S,rippleX:v,rippleY:D,rippleSize:L,cb:x})},[n,U]),_=a.useCallback(()=>{$({},{pulsate:!0})},[$]),j=a.useCallback((f,M)=>{if(clearTimeout(E.current),(f==null?void 0:f.type)==="touchend"&&h.current){h.current(),h.current=null,E.current=setTimeout(()=>{j(f,M)});return}h.current=null,p(x=>x.length>0?x.slice(1):x),g.current=M},[]);return a.useImperativeHandle(s,()=>({pulsate:_,start:$,stop:j}),[_,$,j]),N.jsx(et,A({className:C(m.root,t.root,o),ref:R},c,{children:N.jsx(ie,{component:null,exit:!0,children:u})}))});function ot(e){return Ie("MuiButtonBase",e)}const it=me("MuiButtonBase",["root","disabled","focusVisible"]),rt=["action","centerRipple","children","className","component","disabled","disableRipple","disableTouchRipple","focusRipple","focusVisibleClassName","LinkComponent","onBlur","onClick","onContextMenu","onDragLeave","onFocus","onFocusVisible","onKeyDown","onKeyUp","onMouseDown","onMouseLeave","onMouseUp","onTouchEnd","onTouchMove","onTouchStart","tabIndex","TouchRippleProps","touchRippleRef","type"],st=e=>{const{disabled:r,focusVisible:s,focusVisibleClassName:l,classes:n}=e,o=Ue({root:["root",r&&"disabled",s&&"focusVisible"]},ot,n);return s&&l&&(o.root+=` ${l}`),o},at=te("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(e,r)=>r.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${it.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),Rt=a.forwardRef(function(r,s){const l=be({props:r,name:"MuiButtonBase"}),{action:n,centerRipple:t=!1,children:o,className:c,component:u="button",disabled:p=!1,disableRipple:d=!1,disableTouchRipple:g=!1,focusRipple:b=!1,LinkComponent:E="a",onBlur:h,onClick:R,onContextMenu:U,onDragLeave:$,onFocus:_,onFocusVisible:j,onKeyDown:f,onKeyUp:M,onMouseDown:x,onMouseLeave:S,onMouseUp:I,onTouchEnd:z,onTouchMove:T,onTouchStart:B,tabIndex:v=0,TouchRippleProps:D,touchRippleRef:L,type:k}=l,V=ee(l,rt),O=a.useRef(null),y=a.useRef(null),ge=ce(y,L),{isFocusVisibleRef:re,onFocus:Re,onBlur:Me,ref:xe}=Oe(),[w,X]=a.useState(!1);p&&w&&X(!1),a.useImperativeHandle(n,()=>({focusVisible:()=>{X(!0),O.current.focus()}}),[]);const[q,Te]=a.useState(!1);a.useEffect(()=>{Te(!0)},[]);const ye=q&&!d&&!p;a.useEffect(()=>{w&&b&&!d&&q&&y.current.pulsate()},[d,b,w,q]);function P(i,ae,je=g){return H(le=>(ae&&ae(le),!je&&y.current&&y.current[i](le),!0))}const Ce=P("start",x),Ee=P("stop",U),ve=P("stop",$),Ve=P("stop",I),Pe=P("stop",i=>{w&&i.preventDefault(),S&&S(i)}),Be=P("start",B),De=P("stop",z),Le=P("stop",T),Se=P("stop",i=>{Me(i),re.current===!1&&X(!1),h&&h(i)},!1),ke=H(i=>{O.current||(O.current=i.currentTarget),Re(i),re.current===!0&&(X(!0),j&&j(i)),_&&_(i)}),J=()=>{const i=O.current;return u&&u!=="button"&&!(i.tagName==="A"&&i.href)},Q=a.useRef(!1),we=H(i=>{b&&!Q.current&&w&&y.current&&i.key===" "&&(Q.current=!0,y.current.stop(i,()=>{y.current.start(i)})),i.target===i.currentTarget&&J()&&i.key===" "&&i.preventDefault(),f&&f(i),i.target===i.currentTarget&&J()&&i.key==="Enter"&&!p&&(i.preventDefault(),R&&R(i))}),Fe=H(i=>{b&&i.key===" "&&y.current&&w&&!i.defaultPrevented&&(Q.current=!1,y.current.stop(i,()=>{y.current.pulsate(i)})),M&&M(i),R&&i.target===i.currentTarget&&J()&&i.key===" "&&!i.defaultPrevented&&R(i)});let Y=u;Y==="button"&&(V.href||V.to)&&(Y=E);const K={};Y==="button"?(K.type=k===void 0?"button":k,K.disabled=p):(!V.href&&!V.to&&(K.role="button"),p&&(K["aria-disabled"]=p));const Ne=ce(s,xe,O),se=A({},l,{centerRipple:t,component:u,disabled:p,disableRipple:d,disableTouchRipple:g,focusRipple:b,tabIndex:v,focusVisible:w}),$e=st(se);return N.jsxs(at,A({as:Y,className:C($e.root,c),ownerState:se,onBlur:Se,onClick:R,onContextMenu:Ee,onFocus:ke,onKeyDown:we,onKeyUp:Fe,onMouseDown:Ce,onMouseLeave:Pe,onMouseUp:Ve,onDragLeave:ve,onTouchEnd:De,onTouchMove:Le,onTouchStart:Be,ref:Ne,tabIndex:p?-1:v,type:k},K,V,{children:[o,ye?N.jsx(nt,A({ref:ge,center:t},D)):null]}))});export{Rt as B};
