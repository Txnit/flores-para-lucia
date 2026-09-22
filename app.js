(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const chapters = window.GIFT_CONTENT.chapters;
  const dialog = $('letter-dialog');
  let chapter = 0;
  const dots = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  chapters.forEach((item,index)=>{
    const dot=document.createElement('button');dot.type='button';dot.className='chapter-dot';dot.setAttribute('aria-label',`Página ${index+1}: ${item.title}`);dot.addEventListener('click',()=>showChapter(index));$('chapter-dots').append(dot);dots.push(dot);
  });
  function showChapter(index, focus=true){
    chapter=index;
    $('chapter-kicker').textContent=`${String(index+1).padStart(2,'0')} / 05 · PARA LUCÍA`;
    $('letter-title').textContent=chapters[index].title;
    $('letter-body').replaceChildren();
    for(const text of chapters[index].paragraphs){const p=document.createElement('p');p.textContent=text;$('letter-body').append(p);}
    if(chapters[index].postscript){const p=document.createElement('p');p.textContent=chapters[index].postscript;p.className='postscript';$('letter-body').append(p);}
    const final=index===chapters.length-1;
    $('letter-ending').hidden=!final;
    $('previous-chapter').disabled=index===0;
    $('next-chapter').innerHTML=final?'<span>Volver a mis flores</span> ♡':'<span>Seguir leyendo</span> →';
    dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));
    $('letter-scroll').scrollTop=0;
    $('letter-body').classList.remove('page-turn');void $('letter-body').offsetWidth;$('letter-body').classList.add('page-turn');
    if(focus)$('letter-title').focus({preventScroll:true});
  }
  $('open-letter').addEventListener('click',()=>{showChapter(chapter,false);dialog.showModal();$('letter-title').focus({preventScroll:true});});
  function closeLetter(celebrate=false){dialog.close();$('open-letter').focus({preventScroll:true});if(celebrate)window.Garden.celebrate();}
  $('close-letter').addEventListener('click',()=>closeLetter());
  $('previous-chapter').addEventListener('click',()=>{if(chapter>0)showChapter(chapter-1);});
  $('next-chapter').addEventListener('click',()=>{if(chapter<chapters.length-1)showChapter(chapter+1);else closeLetter(true);});
  dialog.addEventListener('click',e=>{const rect=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom))closeLetter();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&chapter<chapters.length-1){e.preventDefault();showChapter(chapter+1);}if(e.key==='ArrowLeft'&&chapter>0){e.preventDefault();showChapter(chapter-1);}});
  dialog.addEventListener('close',()=>{$('open-letter').focus({preventScroll:true});});

  function setPaused(value){
    window.Garden.setPaused(value);document.body.classList.toggle('motion-paused',value);$('motion-toggle').classList.toggle('is-paused',value);$('motion-toggle').setAttribute('aria-pressed',String(value));const label=value?'Reanudar animaciones':'Pausar animaciones';$('motion-toggle').setAttribute('aria-label',label);$('motion-toggle').title=label;
  }
  $('motion-toggle').addEventListener('click',()=>setPaused(!window.Garden.isPaused()));
  $('bloom-again').addEventListener('click',()=>{if(window.Garden.isPaused()&&!reduceMotion.matches)setPaused(false);window.Garden.bloom();});
  reduceMotion.addEventListener('change',e=>setPaused(e.matches));
  setPaused(reduceMotion.matches);

  // Music is enabled by default. Mobile browsers and in-app browsers may
  // require a real user gesture before allowing audio with sound.
  const music=$('gift-music');
  music.volume=.35;
  let wantsMusic=true, musicPending=false, playAttempt=0;

  function updateMusic(){
    $('music-toggle').setAttribute('aria-pressed',String(wantsMusic));
    $('music-toggle').setAttribute('aria-busy',String(musicPending));
    $('music-toggle').setAttribute('aria-label',musicPending?'Iniciando música':wantsMusic?'Pausar golden hour de JVKE':'Reproducir golden hour de JVKE');
    $('music-toggle').querySelector('.music-state').textContent=musicPending?'…':wantsMusic?'on':'off';
  }

  function musicFailed(){
    musicPending=false;playAttempt++;music.pause();
    $('music-label').textContent='Toca para escuchar';updateMusic();
  }

  async function startMusic(){
    if(!wantsMusic||document.hidden)return false;
    if(!music.paused){$('music-label').textContent='Música';updateMusic();return true;}
    const attempt=++playAttempt;
    musicPending=true;$('music-label').textContent='Música';updateMusic();
    try{
      if(music.error)music.load();
      await music.play();
      if(attempt===playAttempt){$('music-label').textContent='Música';}
      return true;
    }catch{
      if(attempt===playAttempt){musicPending=false;$('music-label').textContent='Toca para escuchar';updateMusic();}
      return false;
    }finally{
      if(attempt===playAttempt){musicPending=false;updateMusic();}
    }
  }

  $('music-toggle').addEventListener('click',()=>{
    // If music is meant to be on but the browser has not unlocked audio yet,
    // this tap should start it instead of turning the preference off.
    if(wantsMusic && music.paused){
      startMusic();
      return;
    }
    wantsMusic=!wantsMusic;
    if(wantsMusic){
      startMusic();
    }else{
      playAttempt++;musicPending=false;music.pause();$('music-label').textContent='Música';updateMusic();
    }
  });

  music.addEventListener('play',()=>{$('music-label').textContent='Música';updateMusic();});
  music.addEventListener('pause',updateMusic);
  music.addEventListener('error',musicFailed);

  function removeUnlockListeners(){
    document.removeEventListener('pointerup',unlockMusic,true);
    document.removeEventListener('touchend',unlockMusic,true);
    document.removeEventListener('click',unlockMusic,true);
    document.removeEventListener('keydown',unlockMusic,true);
  }

  async function unlockMusic(e){
    if(e.target.closest?.('#music-toggle'))return;
    if(!wantsMusic)return;
    const started=await startMusic();
    if(started&&!music.paused)removeUnlockListeners();
  }

  // Different mobile/in-app browsers unlock audio on different gesture events.
  document.addEventListener('pointerup',unlockMusic,true);
  document.addEventListener('touchend',unlockMusic,true);
  document.addEventListener('click',unlockMusic,true);
  document.addEventListener('keydown',unlockMusic,true);

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      playAttempt++;musicPending=false;music.pause();updateMusic();
    }else if(wantsMusic){
      startMusic();
    }
  });

  // Ask the browser to prepare the audio file early; playback still waits
  // for permission when required.
  try{music.load();}catch{}
  updateMusic();
  showChapter(0,false);
})();