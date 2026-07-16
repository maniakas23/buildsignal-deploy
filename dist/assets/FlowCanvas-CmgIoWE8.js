import{r as h,j as S}from"./vendor-DtcMCNhz.js";import{S as y,F as A,P as b,W as C,O as _,E as G,R as z,U as F,V as D,M as E,T as B,a as P,D as T,A as U,C as V,b as j,G as k,c as H,d as L,e as W,f as N,B as q,g as K}from"./three-DwSOyFE7.js";const O=`
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vec3 transformed = position;
    float r = (time + uv.x) * 6.0;
    transformed.y += sin(r) * 0.04;
    transformed.z += cos(r) * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`,X=`
  varying vec2 vUv;
  
  void main() {
    vec3 color = vec3(0.102, 0.102, 0.424);
    float fresnel = pow(1.0 - abs(dot(normalize(vUv.xxx), vec3(0.0, 0.0, 1.0))), 2.0);
    gl_FragColor = vec4(color + fresnel * 0.2, 1.0);
  }
`,I=`
  uniform float time;
  varying float vAlpha;
  
  void main() {
    vec3 pos = position;
    float t = time * 0.5;
    pos.y = mod(pos.y + t, 10.0);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.5 + 0.5 * sin(time + position.x);
    gl_PointSize = 3.0;
  }
`,Z=`
  uniform vec3 color;
  varying float vAlpha;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    gl_FragColor = vec4(color * 2.0, vAlpha);
  }
`;function g(i){let o=0,t=0;for(;o===0;)o=Math.random();for(;t===0;)t=Math.random();return i*.25*Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*t)}function J(i,o=8,t=40){const e=new k,c=[];for(let r=0;r<o;r++){const n=g(t),m=g(t),a=g(t),s=new H(n,m,a);let l=s.length();l<.1&&(s.set(.1,.1,.1),l=.1),s.normalize().multiplyScalar(t*l*.5+t*.2),c.push(s);const p=new E(new L(.12,8,8),new W({color:16777215,depthWrite:!1,transparent:!0,opacity:.4}));p.position.copy(s),e.add(p)}return i.add(e),{points:c,group:e}}function Q(i){const o=new N(i,!0,"centripetal");return o.tension=.5,o}function Y(i,o){const t=new Float32Array(o*3),e=i.getSpacedPoints(o);for(let r=0;r<o;r++){const n=e[r%e.length];t[r*3]=n.x+(Math.random()-.5)*2,t[r*3+1]=n.y+(Math.random()-.5)*2,t[r*3+2]=n.z+(Math.random()-.5)*2}const c=new q;return c.setAttribute("position",new K(t,3)),c}function $(i){const{points:o,group:t}=J(i),e=Q(o),c=new B(e,600,.6,20,!0),r=new P({vertexShader:O,fragmentShader:X,uniforms:{time:{value:0}},side:T}),n=new E(c,r);n.scale.set(.1,.1,.1),i.add(n);const m=Math.ceil(e.getLength()*2),a=Y(e,m),s=new P({vertexShader:I,fragmentShader:Z,uniforms:{time:{value:0},color:{value:new V(15263487)}},transparent:!0,depthWrite:!1,blending:U}),l=new j(a,s);return l.scale.set(.1,.1,.1),i.add(l),{tubeMesh:n,sparkles:l,nodeGroup:t}}function oe(){const i=h.useRef(null),o=h.useRef(null),t=h.useRef(0);return h.useEffect(()=>{const e=i.current;if(!e)return;const c=e.offsetWidth,r=e.offsetHeight,n=new y;n.fog=new A(16184559,.03);const m=new b(45,c/r,.1,200);m.position.set(20,30,60);const a=new C({antialias:!0,alpha:!0});a.setClearColor(16184559,.5),a.setPixelRatio(Math.min(window.devicePixelRatio,1)),a.setSize(c,r),e.appendChild(a.domElement),o.current=a;const s=new _(m,a.domElement);s.enableDamping=!0,s.autoRotate=!0,s.autoRotateSpeed=.25,s.maxDistance=100,s.enableZoom=!1,s.enablePan=!1;const l=new G(a);l.addPass(new z(n,m));const p=new F(new D(c,r),.4,.5,.7);l.addPass(p);const{tubeMesh:f,sparkles:v,nodeGroup:M}=$(n);let w=0;function R(){w+=.005,f.material.uniforms.time.value=w,v.material.uniforms.time.value=w,s.update(),l.render(),t.current=requestAnimationFrame(R)}R();function x(){if(!e)return;const d=e.offsetWidth,u=e.offsetHeight;m.aspect=d/u,m.updateProjectionMatrix(),a.setSize(d,u),l.setSize(d,u)}return window.addEventListener("resize",x),()=>{window.removeEventListener("resize",x),cancelAnimationFrame(t.current),n.remove(f),n.remove(v),n.remove(M),f.geometry.dispose(),f.material.dispose(),v.geometry.dispose(),v.material.dispose(),M.traverse(d=>{d instanceof E&&(d.geometry.dispose(),Array.isArray(d.material)?d.material.forEach(u=>u.dispose()):d.material.dispose())}),s.dispose(),a.dispose(),l.dispose(),p.dispose(),e.contains(a.domElement)&&e.removeChild(a.domElement)}},[]),S.jsx("div",{"code-path":"src/components/FlowCanvas.tsx:266:5",ref:i,style:{width:"100%",height:"560px"},className:"relative"})}export{oe as default};
