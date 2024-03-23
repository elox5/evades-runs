<script lang="ts">
    import RangeSlider from "svelte-range-slider-pips";
    import { maps } from "../data/maps";
    import type {
        GenerationSettings,
        HeroSettings,
        MapSettings,
        PlayerSettings,
    } from "./settings";

    export let mapSettings: MapSettings = {
        generateMap: true,
        bannedMaps: [],
        includeHardMaps: true,
        minVp: 0,
        maxVp: 0,
        minAreas: 0,
        maxAreas: 0,
    };

    export let heroSettings: HeroSettings = {
        generateHeroes: true,
        unique: false,
        named: false,
        players: [],
    };

    export let generationSettings: GenerationSettings = {
        count: 1,
        uniqueMaps: false,
    };

    let heroCount = [1];

    $: if (heroCount) {
        heroSettings.players = [];
        for (let i = 0; i < heroCount[0]; i++) {
            let player: PlayerSettings = {
                bannedHeroes: [],
            };
            heroSettings.players.push(player);
        }
    }

    let availableMaps = maps;
    $: availableMaps = maps.filter((map) => !map.hard || includeHardMaps);

    let vpSliderAvailableMaps = maps;
    $: vpSliderAvailableMaps = availableMaps.filter(
        (map) =>
            map.area_count <= areaValues[areaRange[1]] &&
            map.area_count >= areaValues[areaRange[0]],
    );

    let areaValues = [...new Set(maps.map((map) => map.area_count))].sort(
        (a, b) => a - b,
    );
    let areaRange = [areaValues.indexOf(40), areaValues.indexOf(80)];

    let vpValues = [...new Set(maps.map((map) => map.vp))].sort(
        (a, b) => a - b,
    );
    let vpRange = [0, vpValues.length - 1];

    $: if (vpRange) {
        mapSettings.minVp = vpValues[vpRange[0]];
        mapSettings.maxVp = vpValues[vpRange[1]];
    }

    $: if (areaRange) {
        mapSettings.minAreas = areaValues[areaRange[0]];
        mapSettings.maxAreas = areaValues[areaRange[1]];
    }

    let includeHardMaps: boolean = true;

    $: if (includeHardMaps) {
        mapSettings.includeHardMaps = includeHardMaps;
    }

    //

    $: {
        areaValues = [
            ...new Set(availableMaps.map((map) => map.area_count)),
        ].sort((a, b) => a - b);
    }

    $: {
        vpValues = [
            ...new Set(vpSliderAvailableMaps.map((map) => map.vp)),
        ].sort((a, b) => a - b);
    }

    //

    const areaFormatter = (value: number) => {
        return areaValues[value].toString();
    };

    const vpFormatter = (value: number) => {
        return vpValues[value].toString();
    };
</script>

<div class="settings">
    <div class="settings-section">
        <h1>Map selection</h1>

        <label>
            Generate map
            <input type="checkbox" bind:checked={mapSettings.generateMap} />
        </label>

        {#if mapSettings.generateMap}
            <label>
                Include hard maps
                <input type="checkbox" bind:checked={includeHardMaps} />
            </label>

            <div>
                <p>
                    Area Count: {mapSettings.minAreas} - {mapSettings.maxAreas}
                </p>
                <div class="slider">
                    <RangeSlider
                        min={0}
                        max={areaValues.length - 1}
                        range
                        pips
                        pushy
                        formatter={areaFormatter}
                        springValues={{ stiffness: 1, damping: 1 }}
                        all="label"
                        bind:values={areaRange}
                    />
                </div>
            </div>

            <div>
                <p>VP Amount: {mapSettings.minVp} - {mapSettings.maxVp}</p>
                <div class="slider">
                    <RangeSlider
                        min={0}
                        max={vpValues.length - 1}
                        range
                        pips
                        pushy
                        formatter={vpFormatter}
                        springValues={{ stiffness: 1, damping: 1 }}
                        all="label"
                        bind:values={vpRange}
                    />
                </div>
            </div>
        {/if}
    </div>
    <div class="settings-section">
        <h1>Hero selection</h1>

        <label>
            Generate heroes
            <input type="checkbox" bind:checked={heroSettings.generateHeroes} />
        </label>

        {#if heroSettings.generateHeroes}
            <label>
                Unique heroes
                <input type="checkbox" bind:checked={heroSettings.unique} />
            </label>

            <div>
                <p>Player count: {heroCount[0]}</p>
                <div class="slider">
                    <RangeSlider
                        min={1}
                        max={10}
                        range="min"
                        pips
                        pushy
                        springValues={{ stiffness: 1, damping: 1 }}
                        all="label"
                        bind:values={heroCount}
                    />
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .settings {
        --range-slider: "88ff88";

        width: 400px;
        min-height: 200px;

        font-size: 1.1rem;

        display: flex;
        flex-direction: column;
        gap: 20px;

        background-color: var(--element-bg-color);
        border-radius: 10px;
        padding: 20px;
    }

    @media (min-width: 940px) {
        .settings {
            width: 860px;
            flex-direction: row;
            justify-content: center;
        }

        .settings-section {
            flex: 1;
        }
    }

    .settings-section {
        width: 360px;

        display: flex;
        flex-direction: column;

        gap: 20px;
    }

    h1 {
        font-size: 1.5rem;
        padding: 0;
        margin: 0;
    }
    p {
        margin: 0;
    }

    .slider {
        font-size: 0.8rem;

        --range-slider: #666666;
        --range-handle-inactive: hsl(180, 4.6%, 61.8%);
        --range-handle: #88ff88;
        --range-handle-focus: #88ff88;
        --range-handle-border: #88ff88;
        --range-range-inactive: hsl(180, 4.6%, 61.8%);
        --range-range: #baffba;
        --range-float-inactive: hsl(180, 4.6%, 61.8%);
        --range-float: #88ff88;
        --range-float-text: #000000;

        --range-pip: hsl(210, 14.3%, 53.3%);
        --range-pip-text: hsl(210, 14.3%, 53.3%);
        --range-pip-active: hsl(120, 100%, 60%);
        --range-pip-active-text: #88ff88;
        --range-pip-hover: hsl(180, 25.4%, 24.7%);
        --range-pip-hover-text: #88ff88;
        --range-pip-in-range: hsl(120, 100%, 76.7%);
        --range-pip-in-range-text: #88ff88;
    }
</style>
