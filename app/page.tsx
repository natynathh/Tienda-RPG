"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Camera, CameraOff, Check, ChevronRight, Compass, ExternalLink, Hand, HelpCircle, Info, Mic, MicOff, Music2, RotateCcw, ScrollText, Sparkles, Settings2, Volume2, VolumeX, X } from "lucide-react";
import { demoRanking, formatPlayers, type RankedGame } from "./game-data";
import { RelicArt } from "./relic";

type Screen="intro"|"shop"|"detail"|"concept"|"story";
type ApiResponse={mode:"live"|"demo";games:RankedGame[];fetchedAt:string;coverage:string;note:string};
const intro=[
  "¡Oh! ¡Una visitante! ¡Pasa, pasa! Soy Lira, guardiana de esta pequeña tienda entre mundos.",
  "Aquí no vendo armas ni pociones corrientes...",
  "Cada reliquia es una puerta hacia un mundo donde miles de personas están viviendo una aventura justo ahora.",
  "¿Te gustaría descubrirlos conmigo?"
];
const concept=[
  "Todo comenzó con una pregunta: ¿qué pasaría si pudiéramos ver a todas esas personas jugando al mismo tiempo?",
  "La metáfora es sencilla: cada videojuego es un mundo habitado. Los objetos de mi tienda son puertas a esos mundos; las cifras revelan la intensidad de sus comunidades.",
  "Los números de jugadores conectados muestran presencia simultánea, no la calidad de los vínculos. Por eso la historia final nos invita a mirar más allá de las estadísticas."
];
const story=[
  "Acércate un poquito... Hay algo que quiero contarte. Verás... no todas las grandes aventuras comienzan con una espada, un hechizo o un dragón. Algunas comienzan... frente a una pantalla. Hace algunos años, en un lugar muy lejano, en Noruega, vivía un joven llamado Mats Steen. Mats tenía una enfermedad que debilitaba sus músculos y limitaba cada vez más sus movimientos. Pero lo que muchos desconocían... era que, más allá de su habitación, existía otro mundo que formaba una parte importantísima de su vida.",
  "Y fue allí, en las tierras de Azeroth, dentro del videojuego World of Warcraft, donde Mats dio vida a un personaje llamado Ibelin. ¡Ah, pero Ibelin no era un personaje cualquiera! Era un aventurero que recorría caminos, conocía personas, hacía amigos... y hasta llegó a enamorarse. Junto a otros jugadores compartía historias, risas, discusiones y momentos que recordarían durante mucho tiempo. Porque para Mats, aquel mundo no era simplemente un juego. Era también un lugar donde podía construir relaciones y formar parte de una comunidad.",
  "Pero... como sucede con todas las historias, llegó un día que nadie deseaba. En 2014, Mats falleció a los veinticinco años. Su familia temía que hubiera vivido una vida solitaria, sin imaginar todas las amistades que había construido. Hasta que ocurrió algo inesperado... Empezaron a llegar mensajes. Mensajes de personas de diferentes lugares del mundo que habían conocido a Mats como Ibelin. Personas que lo recordaban con cariño, que compartían sus aventuras y que hablaban de cuánto había significado para ellas. Y fue entonces cuando su familia descubrió una parte de su vida que hasta ese momento desconocía.",
  "¿Lo ves ahora, viajero? Cuando miramos estos mundos, encontramos números... miles, cientos de miles, incluso millones de jugadores conectados. Pero esos números no pueden contarnos todas sus historias. No nos dicen quién encontró un amigo, quién compartió una aventura o quién halló un lugar donde sentirse acompañado. La historia de Mats nos recuerda que las relaciones que nacen en un mundo virtual también pueden ser profundamente reales. Así que, la próxima vez que observes cuántas personas están jugando al mismo tiempo... recuerda algo. Detrás de cada cifra hay una persona. Y cada persona... tiene una historia que contar."
];
const storyTitles=["Una historia diferente","El mundo de Ibelin","El descubrimiento","Más allá de los números"];
const storyBrief=[
  "Acércate un poquito... quiero contarte una historia que comenzó frente a una pantalla.",
  "En Azeroth, Mats se convirtió en Ibelin, un aventurero que encontró una comunidad.",
  "Su familia descubrió cuántas vidas había tocado gracias a los mensajes de sus amigos.",
  "Detrás de cada cifra hay una persona. Y cada persona tiene una historia que contar."
];
const storyFiles=["/audio/lira-story-01.mp3","/audio/lira-story-02.mp3","/audio/lira-story-03.mp3","/audio/lira-story-04.mp3"];
const pause=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));

function CountUp({number}:{number:number}){
  const [value,setValue]=useState(0);
  useEffect(()=>{
    const start=performance.now();let frame=0;
    const tick=(now:number)=>{const progress=Math.min(1,(now-start)/800);setValue(Math.round(number*(1-(1-progress)**3)));if(progress<1)frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[number]);
  return <>{formatPlayers(value)}</>;
}

export default function Home(){
  const [screen,setScreen]=useState<Screen>("intro");
  const [introStep,setIntroStep]=useState(0);
  const [conceptStep,setConceptStep]=useState(0);
  const [storyStep,setStoryStep]=useState(0);
  const [page,setPage]=useState(0);
  const [games,setGames]=useState<RankedGame[]>(demoRanking());
  const [mode,setMode]=useState<"live"|"demo">("demo");
  const [lastUpdate,setLastUpdate]=useState("");
  const [coverage,setCoverage]=useState("Cifras de ejemplo");
  const [selected,setSelected]=useState<RankedGame|null>(null);
  const [busy,setBusy]=useState(false);
  const [actionKind,setActionKind]=useState<"none"|"pick"|"swap">("none");
  const [choiceId,setChoiceId]=useState<string|null>(null);
  const [hoveredGame,setHoveredGame]=useState<string|null>(null);
  const [liraReaction,setLiraReaction]=useState("");
  const [voiceOn,setVoiceOn]=useState(false);
  const [voiceMode,setVoiceMode]=useState<"recorded"|"system">("recorded");
  const [recordedVoiceError,setRecordedVoiceError]=useState(false);
  const [showVoiceSettings,setShowVoiceSettings]=useState(false);
  const [availableVoices,setAvailableVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [voiceChoice,setVoiceChoice]=useState("auto");
  const [voiceSpeaking,setVoiceSpeaking]=useState(false);
  const [musicOn,setMusicOn]=useState(false);
  const [musicVolume,setMusicVolume]=useState(8);
  const [musicError,setMusicError]=useState(false);
  const [micOn,setMicOn]=useState(false);
  const [camOn,setCamOn]=useState(false);
  const [camStatus,setCamStatus]=useState("Cámara apagada");
  const [pointed,setPointed]=useState(0);
  const [feedback,setFeedback]=useState("");
  const [showGuide,setShowGuide]=useState(false);
  const [showSources,setShowSources]=useState(false);
  const [typed,setTyped]=useState("");
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const musicRef=useRef<HTMLAudioElement|null>(null);
  const whooshRef=useRef<HTMLAudioElement|null>(null);
  const videoRef=useRef<HTMLVideoElement|null>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const animationRef=useRef(0);
  const recognizerRef=useRef<any>(null);
  const listenerRef=useRef<any>(null);
  const positionsRef=useRef<Array<{x:number;t:number}>>([]);
  const cooldownRef=useRef(0);
  const gestureActionRef=useRef<(action:string)=>void>(()=>{});
  const pendingRef=useRef(false);
  const shelf=useMemo(()=>games.slice(page*3,page*3+3),[games,page]);
  const pages=Math.max(1,Math.ceil(games.length/3));
  useEffect(()=>{
    setSelected(previous=>previous?games.find(game=>game.id===previous.id)||previous:null);
  },[games]);

  useEffect(()=>{
    let valid=true;
    const load=async()=>{
      try{
        const res=await fetch("/api/steam",{cache:"no-store"});
        if(!res.ok)throw new Error("Steam no disponible");
        const body=await res.json() as ApiResponse;
        if(valid&&body.games?.length){setGames(body.games);setMode(body.mode);setLastUpdate(body.fetchedAt);setCoverage(body.coverage);}
      }catch{if(valid){setMode("demo");setCoverage("Datos ficticios de demostración");}}
    };
    void load();const timer=setInterval(load,90000);
    return()=>{valid=false;clearInterval(timer);};
  },[]);

  const dialogue=screen==="intro"?intro[introStep]:screen==="shop"?
    (feedback||"He colocado tres reliquias sobre mi mostrador. Cada una representa un mundo multijugador. Elige la que te intrigue... ¡o pídeme otras!"):
    screen==="detail"?(feedback||selected?.dialogue||"Acércate a la reliquia."):
    screen==="concept"?concept[conceptStep]:storyBrief[storyStep];
  useEffect(()=>{
    setTyped("");let index=0;
    const timer=setInterval(()=>{index=Math.min(dialogue.length,index+3);setTyped(dialogue.slice(0,index));if(index===dialogue.length)clearInterval(timer);},18);
    return()=>clearInterval(timer);
  },[dialogue]);
  // Las voces instaladas varían entre Opera, Safari, Chrome y cada sistema operativo.
  useEffect(()=>{
    if(typeof window==="undefined"||!window.speechSynthesis)return;
    const syncVoices=()=>setAvailableVoices(window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith("es")));
    syncVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged",syncVoices);
    return()=>window.speechSynthesis.removeEventListener?.("voiceschanged",syncVoices);
  },[]);
  const preferredVoice=useMemo(()=>{
    if(voiceChoice!=="auto"){
      const chosen=availableVoices.find(v=>v.voiceURI===voiceChoice);
      if(chosen)return chosen;
    }
    const feminine=/paulina|m[oó]nica|helena|luc[ií]a|mar[ií]a|sof[ií]a|sabina|carmen|paloma|elvira|alejandra|ximena|catalina|lupe|jimena|alma|isabela|rosa|dalia|female/i;
    const masculine=/jorge|diego|juan|pablo|ra[uú]l|enrique|carlos|antonio|andr[eé]s|daniel|manuel|mario|[aá]lvaro|ricardo|male/i;
    return [...availableVoices].sort((a,b)=>{
      const score=(v:SpeechSynthesisVoice)=>(feminine.test(v.name)?50:0)-(masculine.test(v.name)?50:0)+(v.lang.toLowerCase()==="es-mx"?15:0)+(/natural|premium|enhanced/i.test(v.name)?4:0);
      return score(b)-score(a);
    })[0]||null;
  },[availableVoices,voiceChoice]);
  useEffect(()=>{
    if(!voiceOn||voiceMode!=="system"||typeof window==="undefined"||!window.speechSynthesis){return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(dialogue);
    if(preferredVoice)utterance.voice=preferredVoice;
    utterance.lang=preferredVoice?.lang||"es-MX";
    utterance.rate=.91;utterance.pitch=1.13;utterance.volume=.95;
    utterance.onstart=()=>setVoiceSpeaking(true);
    utterance.onend=()=>setVoiceSpeaking(false);
    utterance.onerror=()=>setVoiceSpeaking(false);
    window.speechSynthesis.speak(utterance);
    return()=>{
      utterance.onstart=null;utterance.onend=null;utterance.onerror=null;
      window.speechSynthesis.cancel();
    };
  },[dialogue,voiceOn,preferredVoice,voiceMode]);
  useEffect(()=>{
    if(screen!=="intro"&&screen!=="story"&&audioRef.current){
      audioRef.current.pause();audioRef.current=null;
      setVoiceSpeaking(false);setVoiceOn(false);
    }
  },[screen]);
  useEffect(()=>()=>{audioRef.current?.pause();window.speechSynthesis?.cancel();},[]);
  const playRecordedIntro=()=>{
    if(typeof window==="undefined")return;
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setRecordedVoiceError(false);
    const clip=new Audio("/audio/lira-intro-01%20(1).mp3");
    setIntroStep(0);
    audioRef.current=clip;
    // Ajuste aproximado de los subtítulos a las pausas detectadas en la grabación.
    clip.ontimeupdate=()=>{
      const t=clip.currentTime;
      setIntroStep(t>=17.3?3:t>=10.8?2:t>=7.55?1:0);
    };
    clip.onplay=()=>{setVoiceOn(true);setVoiceSpeaking(true);};
    clip.onended=()=>{setVoiceOn(false);setVoiceSpeaking(false);};
    clip.onerror=()=>{setVoiceOn(false);setVoiceSpeaking(false);setRecordedVoiceError(true);};
    void clip.play().catch(()=>{setVoiceOn(false);setVoiceSpeaking(false);setRecordedVoiceError(true);});
  };
  const playStoryChapter=(chapter:number)=>{
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    if(typeof window==="undefined")return;
    const clip=new Audio(storyFiles[chapter]);
    audioRef.current=clip;
    clip.onplay=()=>{setVoiceOn(true);setVoiceSpeaking(true);};
    clip.onended=()=>{setVoiceOn(false);setVoiceSpeaking(false);};
    clip.onerror=()=>{setVoiceOn(false);setVoiceSpeaking(false);};
    void clip.play().catch(()=>{setVoiceOn(false);setVoiceSpeaking(false);});
  };
  const stopNarration=()=>{
    audioRef.current?.pause();
    audioRef.current=null;
    window.speechSynthesis?.cancel();
    setVoiceOn(false);
    setVoiceSpeaking(false);
  };
  const toggleVoice=()=>{
    if(voiceOn){
      audioRef.current?.pause();window.speechSynthesis?.cancel();
      setVoiceOn(false);setVoiceSpeaking(false);return;
    }
    if(screen==="intro")playRecordedIntro();
    else if(screen==="story")playStoryChapter(storyStep);
    else if(voiceMode==="system")setVoiceOn(true);
  };
  const previewVoice=()=>{
    if(voiceMode==="recorded"){if(screen==="story")playStoryChapter(storyStep);else {setScreen("intro");playRecordedIntro();}return;}
    if(typeof window==="undefined"||!window.speechSynthesis)return;
    window.speechSynthesis.cancel();
    const sample=new SpeechSynthesisUtterance("¡Hola! Soy Lira, tu mercadera de mundos. ¿Qué aventura te gustaría descubrir hoy?");
    if(preferredVoice)sample.voice=preferredVoice;
    sample.lang=preferredVoice?.lang||"es-MX";sample.rate=.91;sample.pitch=1.13;
    sample.onstart=()=>setVoiceSpeaking(true);sample.onend=()=>setVoiceSpeaking(false);sample.onerror=()=>setVoiceSpeaking(false);
    window.speechSynthesis.speak(sample);
  };

  // La música inicia tras interacción: el autoplay con sonido está bloqueado en muchos navegadores.
  useEffect(()=>{
    const track=musicRef.current;
    if(!track)return;
    if(!musicOn){track.pause();return;}
    track.volume=(musicVolume/100)*(voiceSpeaking||micOn?0.35:1);
    void track.play().catch(()=>{setMusicOn(false);setMusicError(true);});
  },[musicOn]);
  useEffect(()=>{
    const track=musicRef.current;
    if(!track)return;
    track.volume=(musicVolume/100)*(voiceSpeaking||micOn?0.35:1);
  },[musicVolume,voiceSpeaking,micOn]);
  const toggleMusic=()=>{if(musicOn){setMusicOn(false);return;}setMusicError(false);setMusicOn(true);};
  const playWoosh=useCallback(()=>{
    const audio=whooshRef.current;
    if(!audio)return;
    try{audio.pause();audio.currentTime=0;audio.volume=0.38;void audio.play().catch(()=>{});}catch{/* La interacción continúa incluso sin audio. */}
  },[]);
  const goShop=useCallback(()=>{
    if(pendingRef.current)return;
    stopNarration();
    setScreen("shop");setSelected(null);setFeedback("");setBusy(false);setActionKind("none");setChoiceId(null);setHoveredGame(null);setLiraReaction("");
  },[]);
  const nextWorlds=useCallback(async()=>{
    if(pendingRef.current)return;
    playWoosh();pendingRef.current=true;setActionKind("swap");setChoiceId(null);setHoveredGame(null);
    setBusy(true);setLiraReaction("¡Un momento! Tengo más tesoros...");
    setFeedback("¡Apartemos estas reliquias! Tengo más mundos que mostrarte...");
    // Esperar a que termine la salida de los tres objetos, sin intercambiarlos a mitad.
    await pause(960);
    setPage(p=>(p+1)%Math.max(1,Math.ceil(games.length/3)));
    setScreen("shop");setSelected(null);setActionKind("none");setBusy(false);
    setLiraReaction("¡Mira estas nuevas reliquias!");
    await pause(900);
    setFeedback("");setLiraReaction("");pendingRef.current=false;
  },[games.length,playWoosh]);
  const selectGame=useCallback(async(game:RankedGame)=>{
    if(pendingRef.current)return;
    playWoosh();pendingRef.current=true;setSelected(game);setChoiceId(game.id);setActionKind("pick");
    setHoveredGame(null);setBusy(true);setLiraReaction("¡Gran elección! Mira de cerca...");
    setFeedback("¡Ah, esa! Dame un segundo, voy a despejar el mostrador...");
    await pause(1140);
    setScreen("detail");setBusy(false);setActionKind("none");setFeedback("");setLiraReaction("");
    pendingRef.current=false;
  },[playWoosh]);
  const beginConcept=()=>{stopNarration();setConceptStep(0);setFeedback("");setScreen("concept");};
  const beginStory=()=>{stopNarration();setStoryStep(0);setFeedback("");setScreen("story");playStoryChapter(0);};
  const advance=()=>{
    if(screen==="intro"){
      if(audioRef.current&&!audioRef.current.paused){audioRef.current.pause();setVoiceOn(false);setVoiceSpeaking(false);}
      if(introStep<intro.length-1)setIntroStep(s=>s+1);else goShop();
    }
    if(screen==="concept"){if(conceptStep<concept.length-1)setConceptStep(s=>s+1);else goShop();}
    if(screen==="story"){
      if(storyStep<story.length-1){const next=storyStep+1;setStoryStep(next);playStoryChapter(next);}
      else goShop();
    }
  };
  const gestureAction=useCallback((action:string)=>{
    if(action==="next"&&screen!=="intro")void nextWorlds();
    if(action==="back"){if(screen==="intro")goShop();else if(screen!=="shop")goShop();}
    if(action==="confirm"){if(screen==="shop"&&shelf[pointed])void selectGame(shelf[pointed]);else if(screen==="intro"||screen==="story"||screen==="concept")advance();}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[screen,shelf,pointed,introStep,storyStep,conceptStep,nextWorlds,goShop,selectGame]);
  gestureActionRef.current=gestureAction;
  const command=(speech:string)=>{
    const words=speech.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if(/otra|otro|siguiente|cambia|nuev/.test(words)){if(screen!=="intro")void nextWorlds();else goShop();}
    else if(/historia|ibelin|mats|reflexion/.test(words))beginStory();
    else if(/proyecto|metafora|concepto|por que/.test(words))beginConcept();
    else if(/volver|regresar|tienda|inicio/.test(words))goShop();
    else if(/cuant|jugadores|personas|datos/.test(words)&&selected)setFeedback(`En esta consulta aparecen ${formatPlayers(selected.players)} jugadores activos de ${selected.name} ${mode==="live"?"en Steam":"en datos de ejemplo"}.`);
    else if(/primer/.test(words)&&shelf[0])void selectGame(shelf[0]);
    else if(/segundo/.test(words)&&shelf[1])void selectGame(shelf[1]);
    else if(/tercer/.test(words)&&shelf[2])void selectGame(shelf[2]);
    else if(/continu|adelante/.test(words))advance();
    else setFeedback("¡Hmm! No entendí del todo. Prueba «otros juegos», «una historia» o «volver a la tienda».");
  };
  const toggleMic=()=>{
    if(micOn){listenerRef.current?.stop();setMicOn(false);return;}
    const Recognition=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!Recognition){setFeedback("Tu navegador no admite reconocimiento de voz. Puedes usar los botones.");return;}
    try{
      const listener=new Recognition();listener.lang="es-MX";listener.continuous=false;listener.interimResults=false;
      listener.onresult=(event:any)=>command(event.results?.[0]?.[0]?.transcript||"");
      listener.onend=()=>setMicOn(false);listener.onerror=()=>{setMicOn(false);setFeedback("No pude escuchar el comando. Intenta de nuevo.");};
      listenerRef.current=listener;listener.start();setMicOn(true);
    }catch{setFeedback("No pude activar el micrófono.");setMicOn(false);}
  };
  const stopCamera=useCallback(()=>{
    cancelAnimationFrame(animationRef.current);
    streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;
    if(videoRef.current)videoRef.current.srcObject=null;
    recognizerRef.current?.close?.();recognizerRef.current=null;positionsRef.current=[];
    setCamOn(false);setCamStatus("Cámara apagada");
  },[]);
  useEffect(()=>()=>{streamRef.current?.getTracks().forEach(track=>track.stop());cancelAnimationFrame(animationRef.current);},[]);
  const toggleCamera=async()=>{
    if(streamRef.current){stopCamera();return;}
    setCamStatus("Solicitando permiso...");
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw new Error("Se necesita HTTPS y un navegador compatible");
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:640}},audio:false});
      streamRef.current=stream;
      const video=videoRef.current!;video.srcObject=stream;await video.play();
      setCamOn(true);setCamStatus("Cargando reconocimiento...");
      // MediaPipe is loaded only when the user explicitly enables the camera.
      const vision=await import("@mediapipe/tasks-vision");
      const files=await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm");
      recognizerRef.current=await vision.GestureRecognizer.createFromOptions(files,{
        baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"},
        runningMode:"VIDEO",numHands:1
      });
      setCamStatus("↔ otros mundos · 👍 elegir · ✋ volver");
      let frameTime=-1;let processed=0;
      const loop=(now:number)=>{
        if(!streamRef.current)return;
        animationRef.current=requestAnimationFrame(loop);
        if(!recognizerRef.current||video.readyState<2||video.currentTime===frameTime||now-processed<100)return;
        frameTime=video.currentTime;processed=now;
        try{
          const detected=recognizerRef.current.recognizeForVideo(video,now);
          const point=detected.landmarks?.[0]?.[9];const gesture=detected.gestures?.[0]?.[0]?.categoryName;
          if(point){
            const track=positionsRef.current;track.push({x:point.x,t:now});
            while(track.length&&now-track[0].t>580)track.shift();
            setPointed(Math.max(0,Math.min(2,Math.floor((1-point.x)*3))));
            if(track.length>=4&&Math.abs(point.x-track[0].x)>.27&&now-cooldownRef.current>1900){
              cooldownRef.current=now;track.length=0;gestureActionRef.current("next");setCamStatus("↔ Gesto: otros mundos");
            }
          }
          if(now-cooldownRef.current>2200){
            if(gesture==="Thumb_Up"){cooldownRef.current=now;gestureActionRef.current("confirm");setCamStatus("👍 Selección confirmada");}
            if(gesture==="Open_Palm"){cooldownRef.current=now;gestureActionRef.current("back");setCamStatus("✋ Volver");}
          }
        }catch{/* Skip a failed frame without stopping the camera. */}
      };
      animationRef.current=requestAnimationFrame(loop);
    }catch(error){
      stopCamera();setFeedback("No pude activar la cámara. Puedes seguir con mouse o teclado.");
      setCamStatus(error instanceof Error?error.message:"No se pudo iniciar la cámara");
    }
  };

  const updateTime=lastUpdate?new Date(lastUpdate).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}):"—";
  return <main className="app-shell">
    <div className="ambient-stars" aria-hidden="true"/>
    <audio ref={musicRef} src="/audio/blue-harbor-ambient.mp3" loop preload="none" onError={()=>{setMusicOn(false);setMusicError(true);}} aria-label="Música instrumental de fondo"/>
    <audio ref={whooshRef} src="/audio/woosh-world.mp3" preload="auto" aria-label="Efecto de transición de reliquias"/>
    <header className="top-bar">
      <button className="brand" onClick={goShop}><span className="brand-icon"><Sparkles size={22}/></span><span><small>EL MUNDO JUGANDO AL MISMO TIEMPO</small><strong>La tienda de los mundos</strong></span></button>
      <div className="top-center"><span className="live-dot"/>{mode==="live"?"CIFRAS DE STEAM":"MODO DEMOSTRACIÓN"}<span className="center-separator">·</span>Actualizado {updateTime}</div>
      <nav className="top-actions" aria-label="Controles">
        <button className={musicOn?"icon-button active music-button":"icon-button music-button"} title={musicOn?"Pausar música ambiental":"Reproducir música ambiental"} aria-label={musicOn?"Pausar música ambiental":"Reproducir música ambiental"} onClick={toggleMusic}><Music2 size={19}/></button>
        <button className={voiceOn?"icon-button active":"icon-button"} title={voiceOn?"Silenciar a Lira":"Activar voz de Lira"} aria-label={voiceOn?"Silenciar a Lira":"Activar voz de Lira"} onClick={toggleVoice}>{voiceOn?<Volume2 size={19}/>:<VolumeX size={19}/>}</button>
        <button className="icon-button" title="Elegir voz de Lira" aria-label="Elegir voz de Lira" onClick={()=>setShowVoiceSettings(true)}><Settings2 size={19}/></button>
        <button className={micOn?"icon-button active":"icon-button"} title="Hablarle a Lira" aria-label="Hablarle a Lira" onClick={toggleMic}>{micOn?<Mic size={19}/>:<MicOff size={19}/>}</button>
        <button className={camOn?"icon-button active":"icon-button"} title="Gestos con cámara" aria-label="Gestos con cámara" onClick={toggleCamera}>{camOn?<Camera size={19}/>:<CameraOff size={19}/>}</button>
        <button className="icon-button" title="Ayuda" aria-label="Ayuda" onClick={()=>setShowGuide(true)}><HelpCircle size={19}/></button>
      </nav>
    </header>

    <section className="experience" aria-label="Tienda RPG interactiva">
      <div className={`game-stage scene-${screen} ${busy?"scene-busy":""} action-${actionKind}`}>
        <div className="scene-overlay" aria-hidden="true"/>
        <div className="top-stage-label">✧ &nbsp; LA TIENDA ENTRE MUNDOS &nbsp; ✧</div>
        {screen==="shop"&&<div className="shelf-indicator">COLECCIÓN {page+1} / {pages}<div>{Array.from({length:pages},(_,i)=><i key={i} className={i===page?"selected":""}/>)}</div></div>}
        <div className={`npc-wrap ${busy?"npc-action":""} ${screen==="detail"?"npc-inspect":""} ${screen==="story"?"npc-story":""}`}>
          <img className="npc-image" src="/assets/merchant.png" alt="Lira, la mercadera, sonríe detrás del mostrador" draggable={false}/><span className="npc-sparkle a">✦</span><span className="npc-sparkle b">✧</span>
        </div>
        {(liraReaction||(screen==="shop"&&hoveredGame))&&<div className="npc-callout" role="status"><span>✦</span>{liraReaction||("¿Quieres explorar "+hoveredGame+"?")}</div>}
        <div className="counter-lip" aria-hidden="true"/>
        {screen==="intro"&&<div className="welcome-crest"><span>✦</span><small>BIENVENIDA A</small><strong>LA TIENDA ENTRE MUNDOS</strong><span>✦</span></div>}
        {screen==="shop"&&<div className="relic-row" role="group" aria-label="Reliquias seleccionables">
          {shelf.map((game,index)=><button key={game.id}
            className={`relic-slot relic-${index} ${busy?(actionKind==="pick"?(choiceId===game.id?"relic-featured":index<shelf.findIndex(g=>g.id===choiceId)?"relic-eject-left":"relic-eject-right"):"relic-disappear"):""} ${camOn&&pointed===index?"gesture-target":""}`}
            onClick={()=>void selectGame(game)} onMouseEnter={()=>setHoveredGame(game.name)} onMouseLeave={()=>setHoveredGame(null)} onFocus={()=>setHoveredGame(game.name)} onBlur={()=>setHoveredGame(null)}
            disabled={busy} style={{["--relic-glow" as string]:game.accent}}>
            <span className="relic-halo"/><span className="relic-symbol"><RelicArt icon={game.icon} accent={game.accent}/></span><span className="relic-platform"/><span className="relic-number">0{page*3+index+1}</span><strong className="relic-title">{game.name}</strong><small className="relic-subtitle">{game.itemName}</small>
          </button>)}
        </div>}
        {screen==="detail"&&selected&&<div className="detail-display">
          <div className="detail-relic" style={{["--relic-glow" as string]:selected.accent}}><span className="detail-orbit a"/><span className="detail-orbit b"/><RelicArt icon={selected.icon} accent={selected.accent}/></div>
          <div className="detail-info"><div className="eyebrow">{selected.genre.toUpperCase()} · RELIQUIA DESCUBIERTA</div><h2>{selected.name}</h2><div className="detail-tag">{selected.subtitle}</div>
            <div className="big-number"><CountUp number={selected.players}/></div><div className="number-label">JUGADORES CONECTADOS {mode==="live"?"EN STEAM":"· DEMOSTRACIÓN"}</div>
            <div className="stats-grid"><div><span>PARTICIPACIÓN EN LA MUESTRA</span><strong>{(selected.players/Math.max(1,games.reduce((sum,g)=>sum+g.players,0))*100).toLocaleString("es-MX",{minimumFractionDigits:1,maximumFractionDigits:1})}%</strong><small>De {formatPlayers(games.reduce((sum,g)=>sum+g.players,0))} jugadores en {games.length} títulos consultados</small></div><div><span>RANKING</span><strong>#{games.findIndex(g=>g.id===selected.id)+1}</strong><small>Entre {games.length} juegos consultados</small></div></div>
            <p>{selected.description}</p>
          </div>
        </div>}
        {(screen==="story"||screen==="concept")&&<div className={`tale-card ${screen}-card`}>
          <div className="tale-emblem">{screen==="story"?<BookOpen size={27}/>:<Compass size={27}/>}</div>
          <div className="eyebrow">{screen==="story"?"MÁS ALLÁ DE LOS NÚMEROS":"EL ORIGEN DEL PROYECTO"}</div>
          <h2>{screen==="story"?storyTitles[storyStep]:"Un universo de presencias"}</h2><div className="rule-flourish">✦ ───────── ✦</div>
          <p className={screen==="story"?"story-full-script":""}>{screen==="story"?story[storyStep]:["Una pregunta sobre la magnitud de lo simultáneo.","La metáfora detrás de nuestra tienda.","Los datos y sus límites humanos."][conceptStep]}</p>
          <div className="tale-progress">{screen==="story"?`PÁGINA ${storyStep+1} DE ${story.length}`:`CAPÍTULO ${conceptStep+1} DE ${concept.length}`}</div>
          {screen==="story"&&storyStep>=2&&<a target="_blank" rel="noreferrer" href="https://media.netflix.com/en/only-on-netflix/81759420" className="story-source">Fuente del documental <ExternalLink size={13}/></a>}
        </div>}
        <span className="corner-ornament left"/><span className="corner-ornament right"/>
      </div>

      <div className="dialog-panel"><div className={voiceSpeaking?"portrait portrait-talking":"portrait"}><img src="/assets/merchant.png" alt="Retrato de Lira"/></div>
        <div className="dialog-copy"><div className="speaker-line"><strong>LIRA</strong><span>· MERCADERA DE MUNDOS</span></div><p aria-live="polite">{typed}<span className="cursor-blink">▌</span></p></div>
        <div className="dialog-actions">
          {screen==="intro"&&<><button className="action-primary" onClick={advance}>{introStep===intro.length-1?"Entrar a la tienda":"Continuar"} <ChevronRight size={17}/></button><button className="action-secondary" onClick={toggleVoice}>{voiceSpeaking?"Pausar voz":"Escuchar a Lira"} <Volume2 size={16}/></button><button className="action-secondary" onClick={goShop}>Saltar introducción</button></>}
          {screen==="shop"&&<><button className="action-primary" onClick={()=>void nextWorlds()} disabled={busy}><RotateCcw size={15}/> Otros mundos</button><button className="action-secondary" onClick={beginConcept}><ScrollText size={15}/> El proyecto</button><button className="action-secondary" onClick={beginStory}><BookOpen size={15}/> Una historia</button></>}
          {screen==="detail"&&<><button className="action-primary" onClick={goShop}><ArrowLeft size={15}/> Volver a la tienda</button><button className="action-secondary" onClick={()=>void nextWorlds()}><RotateCcw size={15}/> Más mundos</button><button className="action-secondary" onClick={beginStory}><BookOpen size={15}/> La historia</button></>}
          {(screen==="concept"||screen==="story")&&<><button className="action-primary" onClick={advance}>{(screen==="concept"?conceptStep===concept.length-1:storyStep===story.length-1)?"Volver a la tienda":"Siguiente página"} <ArrowRight size={16}/></button>{screen==="story"&&<button className="action-secondary" onClick={toggleVoice}>{voiceSpeaking?"Pausar relato":"Escuchar relato"} <Volume2 size={15}/></button>}<button className="action-secondary" onClick={goShop}>Cerrar libro</button></>}
        </div>
      </div>
    </section>
    <footer className="bottom-bar"><div>✦ &nbsp; Haz clic en una reliquia para descubrir su mundo</div><button onClick={()=>setShowSources(true)}><Info size={14}/> Datos y fuentes</button><span>UNA EXPERIENCIA SOBRE PRESENCIAS, NO SOLO CIFRAS</span></footer>
    <video ref={videoRef} autoPlay muted playsInline className={camOn?"camera-feed visible":"camera-feed"} aria-label="Vista previa de la cámara local"/>
    {camOn&&<div className="camera-caption"><Hand size={14}/>{camStatus}</div>}
    {!camOn&&camStatus!=="Cámara apagada"&&<div className="status-toast" role="status" onClick={()=>setCamStatus("Cámara apagada")}>{camStatus} <X size={12}/></div>}
    {micOn&&<div className="listening-pill"><span/> <Mic size={15}/> Escuchando... di un comando</div>}
    {musicError&&<div className="status-toast music-warning" role="status" onClick={()=>setMusicError(false)}>No fue posible reproducir la música <X size={12}/></div>}
    {mode==="demo"&&<div className="demo-stamp">PROTOTIPO · CIFRAS DE EJEMPLO</div>}

    {showVoiceSettings&&<div className="overlay-backdrop" onClick={()=>setShowVoiceSettings(false)}><div className="overlay-card voice-card" onClick={e=>e.stopPropagation()}>
      <button className="close-modal" onClick={()=>setShowVoiceSettings(false)} aria-label="Cerrar"><X size={20}/></button>
      <div className="modal-badge"><Volume2 size={20}/></div><h2>Sonido de la tienda</h2>
      <p>La voz de Lira te acompaña durante la bienvenida y su relato de Ibelin. Tú decides cuándo escuchar cada capítulo.</p>
      <div className="voice-actions">
        <button className="action-secondary" disabled={screen!=="intro"&&screen!=="story"} onClick={()=>{setShowVoiceSettings(false);toggleVoice();}}><Volume2 size={16}/> {voiceSpeaking?"Pausar narración":"Escuchar a Lira"}</button>
      </div>
      <label className="voice-label" htmlFor="lira-music-volume">Música ambiental · {musicVolume}%</label>
      <input id="lira-music-volume" className="music-volume-range" type="range" min="0" max="20" step="1" value={musicVolume} onChange={e=>setMusicVolume(Number(e.target.value))} aria-label="Volumen de música ambiental"/>
      <div className="music-controls"><button className="action-secondary" onClick={toggleMusic}><Music2 size={15}/> {musicOn?"Pausar música":"Reproducir música"}</button><small>El ambiente musical se atenúa cuando Lira está narrando.</small></div>
      <div className="voice-actions"><button className="action-primary" onClick={()=>setShowVoiceSettings(false)}><Check size={16}/> Listo</button></div>
    </div></div>}
    {showGuide&&<div className="overlay-backdrop" onClick={()=>setShowGuide(false)}><div className="overlay-card" onClick={e=>e.stopPropagation()}>
      <button className="close-modal" onClick={()=>setShowGuide(false)} aria-label="Cerrar"><X size={20}/></button><div className="modal-badge"><Sparkles size={20}/></div><h2>¿Cómo se juega?</h2>
      <p>Habla con Lira, inspecciona reliquias y descubre los mundos que representan.</p>
      <div className="guide-grid"><div><strong>01 · Clic</strong><span>Selecciona objetos y usa los botones de diálogo.</span></div><div><strong>02 · Voz</strong><span>Di «otros juegos», «una historia» o «volver a la tienda».</span></div><div><strong>03 · Gestos</strong><span>Activa la cámara: deslizar = otros juegos; 👍 = elegir; ✋ = volver.</span></div><div><strong>04 · Privacidad</strong><span>La cámara pide permiso, procesa los gestos en tu navegador y puede apagarse.</span></div></div>
      <button className="action-primary modal-action" onClick={()=>setShowGuide(false)}>¡Entendido! <Check size={17}/></button>
    </div></div>}
    {showSources&&<div className="overlay-backdrop" onClick={()=>setShowSources(false)}><div className="overlay-card sources-card" onClick={e=>e.stopPropagation()}>
      <button className="close-modal" onClick={()=>setShowSources(false)} aria-label="Cerrar"><X size={20}/></button><div className="modal-badge"><Info size={20}/></div><h2>Acerca de estas cifras</h2>
      <p>La primera versión consulta jugadores conectados mediante Steam. El ranking se ordena <strong>únicamente entre {games.length} juegos de nuestro catálogo</strong>, no entre todos los videojuegos del mundo.</p>
      <p><strong>Estado:</strong> {mode==="live"?"datos consultados a Steam":"modo demostración con cifras inventadas"}. {coverage}.</p>
      <p>La participación en la muestra indica el porcentaje de jugadores activos que corresponde a cada juego, respecto al total de los títulos consultados en ese momento. No es una cuota de mercado ni un pico histórico.</p>
      <a href="https://store.steampowered.com/charts/mostplayed" target="_blank" rel="noreferrer">Ranking público de Steam <ExternalLink size={15}/></a>
      <button className="action-primary modal-action" onClick={()=>setShowSources(false)}>Regresar <ArrowRight size={16}/></button>
    </div></div>}
  </main>;
}
