<script lang="ts">
    import Button from "./lib/Button.svelte";
    import Settings from "./lib/Settings.svelte";
    import type { HeroSettings, MapSettings } from "./lib/settings";
    import { maps } from "./data/maps";
    import type { MapData } from "./data/maps";

    let mapSettings: MapSettings;
    let heroSettings: HeroSettings;

    let map: MapData;
    let generatedHeroes: string[] = [];

    let notGenerated: boolean = true;
    let generateNothing: boolean = false;

    function generate() {
        notGenerated = false;

        if (!mapSettings.generateMap && !heroSettings.generateHeroes) {
            generateNothing = true;
            return;
        }

        generateNothing = false;

        if (mapSettings.generateMap) {
            generateMap();
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

        map = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    }

    function generateHeroes() {
        for (let i = 0; i < heroSettings.players.length; i++) {}
    }
</script>

<header>
    <h1 class="title">Evades Runs Generator</h1>
</header>
<main>
    <Settings bind:mapSettings bind:heroSettings></Settings>
    <Button onClick={generate}>Generate!</Button>
    <hr />

    <div class="display">
        {#if notGenerated}
            <span class="placeholder">Generated run goes here...</span>
        {:else if generateNothing}
            <span class="placeholder">What did you expect to happen?</span>
        {:else}
            <h3 style="color: {map.color};">{map.name}</h3>
        {/if}
    </div>
</main>
<footer>
    <p>
        Made by
        <a class="elox" href="https://github.com/elox5" target="_blank">
            elOx
        </a>
        and
        <a class="bonsix" href="https://github.com/bonsix" target="_blank">
            Bonsix
        </a>
    </p>
    <p>
        <a class="evades" href="https://evades.io" target="_blank">evades.io</a>
    </p>
    <a href="https://github.com/elox5/evades-runs">Source</a>
</footer>

<style>
    header,
    footer {
        background-color: var(--header-bg-color);

        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    header {
        position: sticky;
        top: 0px;
        z-index: 1;
    }

    main {
        width: 100%;
        min-height: calc(100vh - 140px);

        padding: 40px;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 20px;
    }

    @media (max-width: 480px) {
        main {
            padding-inline: 10px;
            padding-block: 30px;
        }
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

    .display h3 {
        font-size: 1.4rem;
    }

    .placeholder {
        color: #ffffff77;
    }

    a {
        text-decoration: none;
        font-weight: bold;
    }

    a,
    a:visited {
        color: var(--link-color);
    }

    a:hover {
        text-decoration: underline;
    }

    a.elox {
        --link-color: #80ff80;
    }

    a.bonsix {
        --link-color: #3bc1ff;
    }

    a.evades {
        --link-color: #1986cf;
    }

    .title {
        font-weight: normal;
    }
</style>
