// Ordinary audio playback for fixed learning content avoids device TTS failures.
(() => {
 const recordings=window.sparkRecordings||{};
 const plan=window.sparkAudioPlan.create(recordings);
 const normalise=text=>String(text).toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
 const panel=document.querySelector('.voice-panel');
 const status=document.createElement('p');status.id='voiceStatus';status.setAttribute('role','status');status.textContent='Tap a speaker to read. Recorded Karen audio covers stories and activity questions.';
 const label=document.createElement('label');const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=true;toggle.id='recordedVoice';label.append(toggle,document.createTextNode(' Use recorded Karen audio when available'));
 const audioLabel=document.createElement('p');audioLabel.textContent='Sound test: press Play below. This is a recording, so it does not need a browser reading voice.';
 const sample=document.createElement('audio');sample.controls=true;sample.preload='none';sample.setAttribute('aria-label','Test recorded Karen voice');sample.src=recordings[normalise('Hello! Let’s read a little story together.')]||'';sample.style.maxWidth='100%';
 panel.append(label,audioLabel,sample,status);
 window.sparkVoiceStatus=(message,isError=false)=>{status.textContent=message;if(isError)feedback(message)};
 let currentAudio=null;
 const oldStop=stopVoice;
 stopVoice=function(){if(currentAudio){const a=currentAudio;currentAudio=null;a.pause();a.removeAttribute('src');a.load()}if(!sample.paused)sample.pause();oldStop()};
 const browserSpeak=speak;
 speak=function(text){
  if(!sound){window.sparkVoiceStatus('Sound is off. Turn Sound on at the top, then try again.',true);return}
  const clips=toggle.checked?plan(text):null;
  if(!clips){browserSpeak(text);return}
  stopVoice();const a=new Audio();currentAudio=a;a.volume=1;a.playbackRate=voiceRate/.95;
  let index=0,nextClip=null;
  window.sparkVoiceStatus('Loading recorded voice…');
  a.onplaying=()=>{if(currentAudio===a)window.sparkVoiceStatus('Playing recorded Karen voice.')};
  const failed=error=>{if(currentAudio!==a)return;currentAudio=null;a.pause();window.sparkVoiceStatus(error?.name==='NotAllowedError'?'Chrome blocked audio. Use the Play button in Grown-up settings to test sound, then try the speaker again.':'The recording could not play. Check your connection and try the sound test in Grown-up settings.',true)};
  function playNext(){
   if(currentAudio!==a)return;
   if(index===clips.length){currentAudio=null;nextClip=null;window.sparkVoiceStatus('Finished reading.');return}
   a.src=clips[index++];
   // Warm the following clip while this one plays, using the same playback element.
   nextClip=index<clips.length?new Audio(clips[index]):null;
   if(nextClip)nextClip.preload='auto';
   a.play().catch(failed);
  }
  a.onerror=()=>failed();a.onended=playNext;playNext();
 };
 sample.onplay=()=>{if(currentAudio){currentAudio.pause();currentAudio=null}oldStop();window.sparkVoiceStatus('Playing the test recording.')};
 sample.onended=()=>window.sparkVoiceStatus('Test recording finished. If it was silent, check Chrome’s tab mute setting and your device’s audio output.');
 sample.onerror=()=>window.sparkVoiceStatus('The test recording could not load. Please reload the page and try again.',true);
 const oldToggle=document.querySelector('#sound').onclick;
 document.querySelector('#sound').onclick=()=>{oldToggle();if(!sound)stopVoice()};
})();
