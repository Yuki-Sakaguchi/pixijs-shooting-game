var y=Object.defineProperty;var f=(h,t,i)=>t in h?y(h,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):h[t]=i;var n=(h,t,i)=>(f(h,typeof t!="symbol"?t+"":t,i),i);import{s as g,S as w,a,A as x,C as p,T as v}from"./vendor.df2dfb0b.js";const T=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function i(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(s){if(s.ep)return;s.ep=!0;const r=i(s);fetch(s.href,r)}};T();class d{constructor(t,i,e,s="./images/rocket.png"){n(this,"time");n(this,"sprite");this.sprite=a.from(s),this.sprite.interactive=!0,this.sprite.width=e,this.sprite.height=e,this.sprite.anchor.set(.5),this.sprite.x=t,this.sprite.y=i,this.time=0}}class C extends d{constructor(t,i){super(t,i,80);n(this,"hitSizeMin");n(this,"hitSizeMax");this.sprite.zIndex=20,this.hitSizeMin=this.sprite.width*1,this.hitSizeMax=this.sprite.width*1.4}}class L extends d{constructor(t,i,e=1,s=1){super(t,i,100,e===2?"./images/light.png":"./images/light_dark.png");n(this,"enemyType");n(this,"moveType");this.sprite.scale.set(.5),this.sprite.zIndex=10,this.moveType=s,this.enemyType=e}moveRight(){this.sprite.position.x+=this.time/30,this.sprite.scale.set(this.sprite.scale.x+.03)}moveLeft(){this.sprite.position.x+=-(this.time/30),this.sprite.scale.set(this.sprite.scale.x+.03)}moveTop(){this.sprite.position.y+=-(this.time/30),this.sprite.scale.set(this.sprite.scale.x+.03)}moveBottom(){this.sprite.position.y+=this.time/30,this.sprite.scale.set(this.sprite.scale.x+.03)}moveCircle(){}update(){switch(this.moveType){case 1:this.moveRight();break;case 2:this.moveLeft();break;case 3:this.moveTop();break;case 4:this.moveBottom();break;default:this.moveRight()}this.time+=1}}class M{constructor(){n(this,"app");n(this,"width");n(this,"height");n(this,"time");n(this,"container");n(this,"uiContainer");n(this,"player");n(this,"enemyList");n(this,"mousePoint");n(this,"point");n(this,"pointText");g.SCALE_MODE=w.NEAREST,a.from("/images/light.png"),a.from("/images/light_dark.png"),this.width=window.innerWidth,this.height=window.innerHeight,this.mousePoint={x:this.width/2,y:this.height/2},this.time=0,this.app=new x({width:this.width,height:this.height,antialias:!0,resolution:window.devicePixelRatio>1?2:1,autoDensity:!0,resizeTo:window,transparent:!0}),document.body.appendChild(this.app.view),this.container=new p,this.container.sortableChildren=!0,this.app.stage.addChild(this.container),this.player=new C(this.app.screen.width/2,this.app.screen.height/2),this.container.addChild(this.player.sprite),this.enemyList=[],this.point=0,this.pointText=new v(`POINT : ${this.point}`,{fontFamily:"Arial",fontSize:24,fill:16777215,align:"left"}),this.pointText.position.x=10,this.pointText.position.y=10,this.uiContainer=new p,this.uiContainer.addChild(this.pointText),this.app.stage.addChild(this.uiContainer),window.addEventListener("resize",this.resize.bind(this)),window.addEventListener("mousemove",this.onMouseMove.bind(this)),this.render()}createBlock(t,i){const e=new L(this.app.screen.width/2,this.app.screen.height/2,t,i);this.container.addChild(e.sprite),this.enemyList.push(e)}hitTest(t,i){const e=t.width/2,s=t.height/2,r=i.width/2,o=i.height/2,c=t.x-i.x,l=t.y-i.y,m=e+r,u=s+o;return Math.abs(c)<m&&Math.abs(l)<u}random(t,i){return Math.floor(Math.random()*(i+1-t))+t}render(){this.app.ticker.add(()=>{if(this.time+=1,this.player.sprite.position.x=this.mousePoint.x,this.player.sprite.position.y=this.mousePoint.y,this.point>5e3){this.app.destroy(),alert("clear!!");return}for(let i=0;i<this.enemyList.length;i++){const e=this.enemyList[i];if(e.update(),e.sprite.width>this.player.hitSizeMax&&(e.sprite.zIndex=30),e.sprite.x<=0||e.sprite.y<=0||e.sprite.x>=this.app.screen.width||e.sprite.y>=this.app.screen.height){e.sprite.destroy(),this.enemyList.splice(i,1);continue}if(e.sprite.width>this.player.hitSizeMin&&e.sprite.width<this.player.hitSizeMax&&this.hitTest(this.player.sprite,e.sprite)){if(e.sprite.destroy(),this.enemyList.splice(i,1),e.enemyType===1){this.app.destroy(),setTimeout(()=>{alert("game over")},200);return}e.enemyType===2&&(this.point+=100,this.pointText.text=`POINT : ${this.point}`);continue}}const t=this.time>1e3?10:75;if(this.time%t==0){const i=this.random(1,2),e=this.random(1,4);this.createBlock(i,e)}})}resize(){this.width=window.innerWidth,this.height=window.innerHeight,this.app.renderer.resize(window.innerWidth,window.innerHeight),this.container.removeChildren(0,this.container.children.length)}onMouseMove(t){this.mousePoint.x=t.offsetX,this.mousePoint.y=t.offsetY}}new M;
