export interface GenerationSettings {
    count: number;
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
    filteredHeroes: string[];
    unique: boolean;
    named: boolean;
    players: PlayerSettings[];
}

export interface PlayerSettings {
    bannedHeroes: string[];
}