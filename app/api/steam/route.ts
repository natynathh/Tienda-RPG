import { NextResponse } from "next/server";
import { catalogue, demoRanking } from "../../game-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const responses = await Promise.allSettled(catalogue.map(async (game) => {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${game.appId}`,
      { cache: "no-store", signal: AbortSignal.timeout(5500) }
    );
    if (!response.ok) throw new Error("Steam unavailable");
    const body = await response.json() as { response?: { player_count?: number; result?: number } };
    const count = body.response?.player_count;
    if (typeof count !== "number" || count < 0) throw new Error("Invalid player count");
    return { ...game, players: count, live: true };
  }));

  const live = responses.flatMap(r=>r.status === "fulfilled" ? [r.value] : []);
  const mode = live.length >= 3 ? "live" : "demo";
  const games = mode === "live" ? live.sort((a,b)=>b.players-a.players) : demoRanking();
  return NextResponse.json({
    mode, games, fetchedAt,
    coverage: mode === "live" ? `${live.length} de ${catalogue.length} juegos de una selección de Steam` : "Cifras ficticias para demostrar la interacción",
    note: "No es el ranking global de todos los videojuegos. Es una selección de títulos de Steam. Pico 24h y máximo histórico requieren una fuente adicional."
  }, { headers: { "Cache-Control": "no-store" } });
}
