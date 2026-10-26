export type Game = {
  id: string;
  appId: number;
  name: string;
  subtitle: string;
  item: string;
  itemName: string;
  genre: string;
  accent: string;
  demoPlayers: number;
  description: string;
  dialogue: string;
  icon: "rifle" | "orb" | "helmet" | "shield" | "compass" | "wrench" | "blade" | "pickaxe";
};

export type RankedGame = Game & { players: number; live: boolean };

// The fallback counts are fictional demonstration values and never presented as live data.
export const catalogue: Game[] = [
  { id:"cs2",appId:730,name:"Counter-Strike 2",subtitle:"El duelo de la precisión",item:"Arma táctica",itemName:"El fusil de la estrategia",genre:"Shooter táctico",accent:"#e3ac64",demoPlayers:1084500,description:"Dos equipos, una partida y decisiones que se toman en segundos. Cada cifra representa personas colaborando o compitiendo en partidas simultáneas.",dialogue:"¡Buena elección! Detrás de este fusil hay equipos que coordinan cada movimiento. Observa cuántas personas comparten este mundo ahora mismo.",icon:"rifle" },
  { id:"dota",appId:570,name:"Dota 2",subtitle:"Una arena, infinitas estrategias",item:"Reliquia arcana",itemName:"El orbe ancestral",genre:"MOBA",accent:"#96dbd1",demoPlayers:645200,description:"En cada partida, cinco personas dependen de otras cinco. La coordinación, las decisiones y las relaciones hacen de cada encuentro una experiencia compartida.",dialogue:"Este orbe nunca brilla solo. En Dota 2, la estrategia se construye entre jugadores que quizá nunca se han conocido fuera de la pantalla.",icon:"orb" },
  { id:"pubg",appId:578080,name:"PUBG: BATTLEGROUNDS",subtitle:"Historias de supervivencia",item:"Casco de combate",itemName:"El casco del último círculo",genre:"Battle royale",accent:"#f1b779",demoPlayers:330800,description:"Un mapa, cientos de decisiones y alianzas inesperadas. La tensión del juego sucede al mismo tiempo en miles de pantallas.",dialogue:"¿Escuchas eso? Es el último círculo acercándose. Miles de jugadores luchan por sobrevivir y cuentan historias distintas dentro del mismo juego.",icon:"helmet" },
  { id:"apex",appId:1172470,name:"Apex Legends",subtitle:"Leyendas en escuadrón",item:"Escudo energético",itemName:"El escudo de las leyendas",genre:"Hero shooter",accent:"#ef9a9b",demoPlayers:198200,description:"Escuadrones de tres personas combinan habilidades y estrategias. El vínculo entre compañeros puede ser tan importante como la victoria.",dialogue:"En este mundo nadie llega lejos del todo a solas. ¡Un buen escuadrón puede transformar una partida!",icon:"shield" },
  { id:"rust",appId:252490,name:"Rust",subtitle:"Construir, confiar, sobrevivir",item:"Brújula de supervivencia",itemName:"La brújula salvaje",genre:"Supervivencia",accent:"#c9a7d6",demoPlayers:136400,description:"Comunidades construyen refugios, negocian recursos y sobreviven juntas en servidores persistentes.",dialogue:"Algunos construyen fortalezas; otros construyen amistades. Este mundo cambia según las personas que lo habitan.",icon:"compass" },
  { id:"tf2",appId:440,name:"Team Fortress 2",subtitle:"El ingenio del equipo",item:"Herramienta mecánica",itemName:"La llave del ingeniero",genre:"Acción multijugador",accent:"#dda97d",demoPlayers:88200,description:"Clases diferentes se necesitan unas a otras. La diversidad de roles convierte a cada equipo en algo más que la suma de sus partes.",dialogue:"Esta llave arregla máquinas, pero también me recuerda que ningún equipo funciona sin las habilidades de los demás.",icon:"wrench" },
  { id:"warframe",appId:230410,name:"Warframe",subtitle:"Guardianes del vacío",item:"Espada ceremonial",itemName:"La hoja del vacío",genre:"Acción cooperativa",accent:"#a9c8f9",demoPlayers:66400,description:"Una aventura cooperativa donde jugadores de distintos lugares se unen para superar misiones y explorar el universo.",dialogue:"Una espada puede parecer solitaria... hasta que descubres la misión cooperativa que comparte con otros guerreros.",icon:"blade" },
  { id:"terraria",appId:105600,name:"Terraria",subtitle:"Un mundo para crear juntos",item:"Pico de exploración",itemName:"El pico de los descubrimientos",genre:"Sandbox",accent:"#a8dca7",demoPlayers:47500,description:"Construir, explorar y descubrir se convierte en una experiencia distinta cuando un mundo se comparte con otras personas.",dialogue:"Con un solo pico comienzan aventuras enormes. Algunos de los mundos más memorables son los que construimos con alguien más.",icon:"pickaxe" },
];

export function formatPlayers(value:number):string {
  return new Intl.NumberFormat("es-MX").format(value);
}

export function demoRanking():RankedGame[] {
  return catalogue.map(g => ({...g,players:g.demoPlayers,live:false})).sort((a,b)=>b.players-a.players);
}
