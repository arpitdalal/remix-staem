import supabaseClient from "~/services/supabase.server";
import type { Game } from "~/types";

import type { PostgrestError } from "@supabase/supabase-js";

type GetAllGamesReturn = {
  games?: Game[];
  error?: string;
};
export async function getAllGames(
  rangeStart: number,
  rangeEnd: number,
  search: string,
  sort: keyof Pick<Game, "title" | "price">,
  sortOrder: "asc" | "desc",
): Promise<GetAllGamesReturn> {
  let games: Game[] | null;
  let gamesError: PostgrestError | null;

  if (search) {
    const { data, error } = await supabaseClient
      .from<Game>("steam")
      .select("*")
      .range(rangeStart, rangeEnd)
      .textSearch("title", `'${search}'`)
      .order(sort, { ascending: sortOrder === "asc" });
    games = data;
    gamesError = error;
  } else {
    const { data, error } = await supabaseClient
      .from<Game>("steam")
      .select("*")
      .range(rangeStart, rangeEnd)
      .order(sort, { ascending: sortOrder === "asc" });
    games = data;
    gamesError = error;
  }

  if (gamesError || !games) {
    return {
      error: gamesError?.message,
    };
  }
  return { games };
}

type GetGamesCountReturn = {
  count?: number;
  error?: string;
};
export async function getGamesCount(
  search: string,
): Promise<GetGamesCountReturn> {
  let count: Game[] | null;
  let countError: PostgrestError | null;

  if (search) {
    const { data, error } = await supabaseClient
      .from<Game>("steam")
      .select("*", { count: "exact" })
      .textSearch("title", `'${search}'`);
    count = data;
    countError = error;
  } else {
    const { data, error } = await supabaseClient
      .from<Game>("steam")
      .select("*");
    count = data;
    countError = error;
  }

  if (countError || !count) {
    return {
      error: countError?.message,
    };
  }
  return { count: count.length };
}
