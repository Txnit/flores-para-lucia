/* Flores dibujadas y animadas con Canvas. No hay vídeos, imágenes externas ni librerías. */
(() => {
  'use strict';
  const canvas = document.getElementById('bouquet');
  const ctx = canvas.getContext('2d');
  const sky = document.getElementById('atmosphere');
  const stars = sky.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const blooms = [
    { x: 453, y: 220, r: 94, tilt: -.13, delay: .2 },
    { x: 257, y: 343, r: 87, tilt: -.36, delay: .42 },
    { x: 650, y: 302, r: 86, tilt: .28, delay: .62 },
    { x: 476, y: 438, r: 99, tilt: .07, delay: .82 },
    { x: 282, y: 554, r: 75, tilt: -.2, delay: 1.02 },
    { x: 650, y: 557, r: 80, tilt: .34, delay: 1.22 },
    { x: 450, y: 645, r: 72, tilt: -.16, delay: 1.4 }
  ];
  let time = 0;
  let lastTime = 0;
  let animationId = 0;
  let bloomStart = reduced.matches ? -9 : -0.25;
  let paused = reduced.matches;
  let width = 0, height = 0;
  let pointer = { x: 0, y: 0 };
  let celebration = [];
  let messageTimer;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = n => 1 - Math.pow(1 - clamp(n), 3);
  const noise = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

  function flowerSprite(radius, index) {
    const image = document.createElement('canvas');
    image.width = image.height = 420;
    const c = image.getContext('2d');
    c.translate(210, 210);
    c.scale(1.85, 1.85);
    // Three staggered whorls give each flower its own layered silhouette.
    for (let layer = 0; layer < 3; layer++) {
      const count = [21, 17, 13][layer];
      for (let p = 0; p < count; p++) {
        const variation = noise(p + index * 71 + layer * 29);
        const length = radius * [1, .8, .59][layer] * (.91 + variation * .15);
        const petalWidth = length * [.17, .23, .28][layer];
        const angle = p / count * Math.PI * 2 + layer * .19 + index * .27;
        c.save();
        c.rotate(angle);
        c.shadowColor = 'rgba(56,34,4,.28)'; c.shadowBlur = 3; c.shadowOffsetY = 2;
        const gradient = c.createLinearGradient(0, -length, petalWidth * .3, -7);
        gradient.addColorStop(0, layer ? '#ffe990' : '#f7d263');
        gradient.addColorStop(.26, layer ? '#ffe075' : '#efbf40');
        gradient.addColorStop(.67, '#e5a923');
        gradient.addColorStop(1, '#926012');
        c.fillStyle = gradient;
        c.beginPath(); c.moveTo(-3, -9);
        c.bezierCurveTo(-petalWidth * .75, -length * .39, -petalWidth * 1.1, -length * .8, -petalWidth * .35, -length * .98);
        c.bezierCurveTo(-petalWidth * .04, -length * 1.04, petalWidth * .58, -length * 1.02, petalWidth * .73, -length * .89);
        c.bezierCurveTo(petalWidth * 1.25, -length * .64, petalWidth * .55, -length * .27, 4, -9);
        c.closePath(); c.fill();
        c.shadowColor = 'transparent';
        c.strokeStyle = 'rgba(255,245,171,.28)'; c.lineWidth = .7;
        c.beginPath(); c.moveTo(1,-16); c.quadraticCurveTo(petalWidth * .14,-length * .65,0,-length * .95); c.stroke();
        c.restore();
      }
    }
    const r = radius * .25;
    const center = c.createRadialGradient(-r * .35, -r * .4, 0, 0, 0, r);
    center.addColorStop(0,'#977532'); center.addColorStop(.5,'#674821'); center.addColorStop(1,'#322b16');
    c.shadowColor = '#785414'; c.shadowBlur = 4;
    c.fillStyle = center; c.beginPath(); c.arc(0,0,r,0,Math.PI*2); c.fill();
    c.shadowColor = 'transparent';
    for (let i=0;i<300;i++) {
      const a = i * 2.39996, d = Math.sqrt(i/300) * r * .97;
      const x = Math.cos(a)*d, y = Math.sin(a)*d;
      c.fillStyle = ['#d0a349','#b18633','#876326','#e7bb56'][Math.floor(noise(i+index*30)*4)];
      c.beginPath();c.ellipse(x,y,.72 + noise(i)*.6,1.05,a,0,Math.PI*2);c.fill();
    }
    return image;
  }
  const sprites = blooms.map((b,i) => flowerSprite(b.r,i));

  function leaf(c, x, y, length, angle, light = false, growth = 1) {
    c.save(); c.translate(x,y);c.rotate(angle);c.scale(growth,growth);
    const gradient = c.createLinearGradient(0,0,length,-length*.3);
    gradient.addColorStop(0,'#294731');gradient.addColorStop(.5,light?'#66854b':'#416641');gradient.addColorStop(1,light?'#a3a566':'#668951');
    c.fillStyle=gradient;c.beginPath();c.moveTo(0,0);
    c.bezierCurveTo(length*.26,-length*.47,length*.64,-length*.34,length,0);
    c.bezierCurveTo(length*.69,length*.24,length*.2,length*.25,0,0);c.fill();
    c.strokeStyle=light?'#b1bd783d':'#afc08a30';c.lineWidth=.9;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(length*.46,-length*.05,length*.92,0);c.stroke();
    for(let k=1;k<5;k++){const px=length*k/6;c.beginPath();c.moveTo(px,0);c.lineTo(px+length*.1,-length*.16);c.stroke();}
    c.restore();
  }
  function stem(x, y, baseX, baseY, progress, index) {
    ctx.save();
    ctx.beginPath();ctx.moveTo(baseX,baseY);
    ctx.bezierCurveTo(baseX+(x-baseX)*.16,baseY-190,x+(index%2?32:-25),y+160,x,y);
    ctx.strokeStyle='#213d29';ctx.lineWidth=8;ctx.lineCap='round';ctx.setLineDash([1100*progress,1400]);ctx.stroke();
    ctx.strokeStyle='#68814a';ctx.lineWidth=3.2;ctx.stroke();ctx.setLineDash([]);
    ctx.restore();
  }
  function branch(x,y,endX,endY,side,progress,phase) {
    ctx.save();ctx.globalAlpha=progress;ctx.strokeStyle='#4b6741';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(endX+side*15,y-100,endX,endY);ctx.stroke();
    for(let i=0;i<5;i++){
      const k=(i+.3)/5;const px=x+(endX-x)*k+Math.sin(k*Math.PI)*side*10,py=y+(endY-y)*k;
      leaf(ctx,px,py,(52-i*5)*progress,side>0?-.7+phase:Math.PI+.7+phase,i%2===0);
      leaf(ctx,px,py,(43-i*5)*progress,side>0?-2+phase:-1.1+phase);
    }
    ctx.restore();
  }
  function ribbon(progress) {
    ctx.save();ctx.translate(488,824);ctx.scale(progress,progress);
    const gradient=ctx.createLinearGradient(-70,-30,85,42);gradient.addColorStop(0,'#a7803d');gradient.addColorStop(.45,'#e0c17a');gradient.addColorStop(1,'#847037');ctx.fillStyle=gradient;
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-93,-63,-119,12,-11,7);ctx.bezierCurveTo(-106,61,-66,58,-32,105);ctx.lineTo(-22,80);ctx.lineTo(-9,92);ctx.quadraticCurveTo(-60,28,0,12);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(75,-64,122,-15,10,12);ctx.bezierCurveTo(59,24,30,67,65,86);ctx.lineTo(48,88);ctx.lineTo(48,106);ctx.bezierCurveTo(14,74,47,29,0,10);ctx.closePath();ctx.fill();
    ctx.fillStyle='#e1c686';ctx.beginPath();ctx.ellipse(0,5,12,8,-.3,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  const motes = Array.from({length:40},(_,i)=>({x:noise(i*3),y:noise(i*3+1),size:.7+noise(i*3+2)*1.5,speed:.4+noise(i+8),phase:noise(i+64)*Math.PI*2}));
  function drawAtmosphere() {
    stars.clearRect(0,0,width,height);
    for(const m of motes){
      const x=m.x*width+Math.sin(time*.2+m.phase)*24;
      const y=((m.y*height-time*7*m.speed)%height+height)%height;
      const alpha=.15+(Math.sin(time*.7+m.phase)+1)*.2;
      stars.fillStyle=`rgba(234,213,138,${alpha})`;stars.beginPath();stars.arc(x,y,m.size,0,Math.PI*2);stars.fill();
    }
    for(const p of celebration){
      const age=time-p.birth;if(age>6)continue;
      const x=p.x+p.vx*age, y=p.y+p.vy*age+age*age*12;
      stars.save();stars.translate(x,y);stars.rotate(p.angle+age*p.spin);stars.globalAlpha=clamp(1-age/6);stars.fillStyle=p.color;stars.beginPath();stars.ellipse(0,0,p.size,p.size*.4,0,0,Math.PI*2);stars.fill();stars.restore();
    }
    celebration=celebration.filter(p=>time-p.birth<6);
  }
  function draw() {
    ctx.clearRect(0,0,900,1000);
    const age=time-bloomStart;
    const progress=ease(age/2.4);
    const breeze=paused?0:Math.sin(time*.6)*.012;
    ctx.save();ctx.translate(480,880);ctx.rotate(breeze+pointer.x*.006);ctx.translate(-480,-880);
    branch(482,825,213,416,-1,progress,breeze);
    branch(498,815,732,396,1,progress,breeze);
    branch(485,833,334,285,-1,progress,-breeze);
    branch(498,825,595,211,1,progress,breeze);
    branch(485,842,187,677,-1,progress,breeze);
    branch(495,843,747,650,1,progress,-breeze);
    blooms.forEach((b,i)=>{
      const p=ease((age-b.delay)/2);
      const sway=paused?0:Math.sin(time*.8+i*1.9)*4;
      stem(b.x+sway,b.y,476+i*4,890-i*4,p,i);
      const lx=(b.x+490)*.5,ly=(b.y+860)*.5;
      leaf(ctx,lx,ly,90,i%2?-.6:-2.9,i%3===0,p);
      leaf(ctx,lx+(i%2?13:-7),ly+85,65,i%2?-2.8:-.6,false,p);
    });
    // Small sprigs fill the base without obscuring the flowers.
    for(let i=0;i<9;i++)leaf(ctx,460+i*7,787+(i%3)*17,64+noise(i)*40,i%2?-2.65:-.51,i%3===0,progress);
    blooms.forEach((b,i)=>{
      const p=ease((age-b.delay-1)/1.4);if(p<=0)return;
      const sway=paused?0:Math.sin(time*.8+i*1.9)*4;
      ctx.save();ctx.translate(b.x+sway,b.y);ctx.rotate(b.tilt+(paused?0:Math.sin(time*.55+i)*.025));ctx.scale(p,p*(i===2?.88:.96));
      ctx.globalAlpha=clamp(p*2);ctx.drawImage(sprites[i],-113.5,-113.5,227,227);ctx.restore();
    });
    ribbon(progress);ctx.restore();drawAtmosphere();
  }
  function frame(now) {
    if(paused||document.hidden){animationId=0;return;}
    time+=Math.min((now-(lastTime||now))/1000,.05);lastTime=now;draw();animationId=requestAnimationFrame(frame);
  }
  function resume(){lastTime=0;if(!animationId&&!paused&&!document.hidden)animationId=requestAnimationFrame(frame);}
  function resize(){
    width=window.innerWidth;height=window.innerHeight;
    const dpr=Math.min(window.devicePixelRatio||1,2);sky.width=Math.round(width*dpr);sky.height=Math.round(height*dpr);stars.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function burst(atX=width*.68,atY=height*.4){
    if(paused)return;
    for(let i=0;i<65;i++)celebration.push({x:atX,y:atY,birth:time,vx:(noise(i+time)*2-1)*100,vy:-50-noise(i+8+time)*150,size:3+noise(i+31)*5,spin:(noise(i+84)-.5)*4,angle:noise(i+56)*6.28,color:['#efc65d','#f8dfa0','#b5bb7b','#efd184'][i%4]});
  }
  const buttonHost=document.getElementById('flower-buttons');
  blooms.forEach((b,i)=>{
    const button=document.createElement('button');button.type='button';button.className='flower-target';button.style.left=`${b.x/9}%`;button.style.top=`${b.y/10}%`;button.setAttribute('aria-label',`Flor ${i+1}: descubrir un mensaje para ti`);
    button.addEventListener('click',()=>{
      buttonHost.querySelectorAll('button').forEach(el=>el.classList.remove('selected'));button.classList.add('selected');
      const note=document.getElementById('flower-message');note.querySelector('p').textContent=window.GIFT_CONTENT.flowers[i];note.classList.add('visible');
      clearTimeout(messageTimer);messageTimer=setTimeout(()=>{note.classList.remove('visible');button.classList.remove('selected');},6500);
      const rect=button.getBoundingClientRect();burst(rect.x+rect.width/2,rect.y+rect.height/2);
    });buttonHost.append(button);
  });
  document.getElementById('bouquet-stage').addEventListener('pointermove',e=>{const rect=canvas.getBoundingClientRect();pointer.x=clamp((e.clientX-rect.left)/rect.width,0,1)*2-1;});
  document.getElementById('bouquet-stage').addEventListener('pointerleave',()=>{pointer.x=0;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(animationId);animationId=0;}else resume();});
  window.addEventListener('resize',resize);
  window.Garden={
    setPaused(value){paused=value;if(value&&reduced.matches)bloomStart=time-9;cancelAnimationFrame(animationId);animationId=0;draw();resume();},
    bloom(){bloomStart=paused?time-9:time;document.getElementById('flower-message').classList.remove('visible');draw();resume();},
    celebrate(){burst(width*.5,height*.45);},
    isPaused:()=>paused
  };
  resize();resume();
})();
