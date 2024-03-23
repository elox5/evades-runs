import type { Hero } from "../data/heroes";

export interface GenerationSettings {
    repeat: number;
    uniqueMaps: boolean;
}

export interface MapSettings {
    generateMap: boolean;
    bannedMaps: string[];
    includeHardMaps: boolean;
    minVp: number;
    maxVp: number;
    minAreas: number;
    maxAreas: number;
}

export interface HeroSettings {
    generateHeroes: boolean;
    unique: boolean;
    named: boolean;
    players: PlayerSettings[];
}

export interface PlayerSettings {
    bannedHeroes: Hero[];
}