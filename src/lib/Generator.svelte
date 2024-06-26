<script lang="ts">
    import Settings from "./Settings.svelte";
    import type { HeroSettings, MapSettings } from "./settings";
    import { maps } from "../data/maps";
    import type { MapData } from "../data/maps";
    import { heroes, type HeroData } from "../data/heroes";

    let mapSettings: MapSettings;
    let heroSettings: HeroSettings;

    let map: MapData | null = null;
    let generatedHeroes: HeroData[] = [];

    let notGenerated: boolean = true;
    let generateNothing: boolean = false;
    let zeroMaps: boolean = false;
    let zeroHeroes: boolean = false;
    let noFittingMaps: boolean = false;
    let notEnoughHeroes: boolean = false;

    function generate() {
        notGenerated = false;
        zeroMaps = false;
        zeroHeroes = false;
        noFittingMaps = false;
        notEnoughHeroes = false;

        if (!mapSettings.generateMap && !heroSettings.generateHeroes) {
            generateNothing = true;
            return;
        }

        if (maps.length === mapSettings.bannedMaps.length) {
            zeroMaps = true;
            return;
        }

        if (heroes.length === heroSettings.filteredHeroes.length) {
            zeroHeroes = true;
            return;
        }

        generateNothing = false;
        map = null;
        generatedHeroes = [];

        if (mapSettings.generateMap) {
            generateMap();
        }
        if (heroSettings.generateHeroes) {
            generateHeroes();
        }
    }

    function generateMap() {
        let availableMaps = maps
            .filter(
                (map) => mapSettings.bannedMaps.indexOf(map.short_name) === -1,
            )
            .filter((map) => !map.hard || mapSettings.includeHardMaps)
            .filter(
                (map) =>
                    map.vp >= mapSettings.minVp && map.vp <= mapSettings.maxVp,
            )
            .filter(
                (map) =>
                    map.area_count >= mapSettings.minAreas &&
                    map.area_count <= mapSettings.maxAreas,
            );

        if (availableMaps.length === 0) {
            noFittingMaps = true;
            return;
        }

        map = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    }

    function generateHeroes() {
        let availableHeroes = heroes.filter(
            (hero) => heroSettings.filteredHeroes.indexOf(hero.name) === -1,
        );

        if (
            heroSettings.unique &&
            heroSettings.players.length > availableHeroes.length
        ) {
            notEnoughHeroes = true;
            return;
        }

        for (let i = 0; i < heroSettings.players.length; i++) {
            let generatedHero =
                availableHeroes[
                    Math.floor(Math.random() * availableHeroes.length)
                ];

            if (
                heroSettings.unique &&
                heroSettings.players.length <= availableHeroes.length
            ) {
                while (generatedHeroes.includes(generatedHero)) {
                    generatedHero =
                        availableHeroes[
                            Math.floor(Math.random() * availableHeroes.length)
                        ];
                }
            }

            generatedHeroes.push(generatedHero);
        }
    }
</script>

<div class="generator">
    <Settings bind:mapSettings bind:heroSettings></Settings>
    <button style="font-size: 1.2rem" on:click={generate}>Generate!</button>

    <div class="display">
        {#if notGenerated}
            <span class="placeholder">Generated run goes here...</span>
        {:else if generateNothing}
            <span class="placeholder">What did you expect to happen?</span>
        {:else if zeroMaps}
            <span class="placeholder">You filtered out all of the maps</span>
        {:else if zeroHeroes}
            <span class="placeholder">You filtered out all of the heroes</span>
        {:else if noFittingMaps}
            <span class="placeholder">No maps fit these filters</span>
        {:else if notEnoughHeroes}
            <span class="placeholder">
                Not enough heroes to uniquely distribute
            </span>
        {:else}
            {#if map}
                <h3 style="color: {map?.color};">{map?.name}</h3>
            {/if}

            <div class="hero-list">
                {#each generatedHeroes as hero, index}
                    <span class="hero-name" style="color: {hero.color};">
                        {hero.name}
                    </span>
                    {#if index < generatedHeroes.length - 1}
                        <span class="bullet">•</span>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .generator {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 20px;
    }

    .display {
        width: 400px;
        min-height: 200px;

        font-size: 1.5rem;

        background-color: var(--element-bg-color);
        border-radius: 10px;
        padding: 20px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 450px) {
        .display {
            width: 100%;
        }
    }

    .display h3 {
        font-size: 1.4rem;
    }

    .hero-list {
        font-size: 1.2rem;
    }

    .hero-name {
        text-shadow: 0px 0px 5px black;
    }

    .bullet {
        margin: 10px;
    }

    .placeholder {
        color: #ffffff77;
    }
</style>
