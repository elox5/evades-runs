<script lang="ts">
    import RangeSlider from "svelte-range-slider-pips";
    import { maps } from "../data/maps";
    import type { HeroSettings, MapSettings, PlayerSettings } from "./settings";
    import { heroes, type HeroData } from "../data/heroes";
    import { Plus } from "lucide-svelte";

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
        filteredHeroes: [],
        unique: false,
        named: false,
        players: [],
    };

    //

    let mapFilterModal: HTMLDialogElement;

    let mapFilterText = "";
    $: {
        if (mapSettings.bannedMaps.length === 0) {
            mapFilterText = "All";
        } else if (mapSettings.bannedMaps.length === maps.length) {
            mapFilterText = "None??";
        } else if (maps.length - mapSettings.bannedMaps.length === 1) {
            mapFilterText = "1 Map?";
        } else {
            mapFilterText = `${maps.length - mapSettings.bannedMaps.length} Maps`;
        }
    }

    let heroFilterModal: HTMLDialogElement;

    let heroFilterText = "";
    $: {
        if (heroSettings.filteredHeroes.length === 0) {
            heroFilterText = "All";
        } else if (heroSettings.filteredHeroes.length === heroes.length) {
            heroFilterText = "None??";
        } else if (heroes.length - heroSettings.filteredHeroes.length === 1) {
            heroFilterText = "1 Hero?";
        } else {
            heroFilterText = `${heroes.length - heroSettings.filteredHeroes.length} Heroes`;
        }
    }

    //

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

    let areaRange = [2, 3];

    let vpValues: number[] = [];
    $: {
        vpValues = [
            ...new Set(
                maps
                    .filter((map) => !map.hard || mapSettings.includeHardMaps)
                    .filter(
                        (map) =>
                            map.area_count >= mapSettings.minAreas &&
                            map.area_count <= mapSettings.maxAreas,
                    )
                    .map((map) => map.vp),
            ),
        ].sort((a, b) => a - b);
    }
    let lastMinVp = 0;
    let lastMaxVp = 0;
    let vpRange = [0, 12];

    $: if (areaRange) {
        mapSettings.minAreas = areaLengths[areaRange[0]].min;
        mapSettings.maxAreas = areaLengths[areaRange[1]].max;
    }
    $: if (vpRange) {
        let vpValuesLocal = [
            ...new Set(
                maps
                    .filter((map) => !map.hard || mapSettings.includeHardMaps)
                    .filter(
                        (map) =>
                            map.area_count >= mapSettings.minAreas &&
                            map.area_count <= mapSettings.maxAreas,
                    )
                    .map((map) => map.vp),
            ),
        ].sort((a, b) => a - b);

        lastMinVp = mapSettings.minVp;
        lastMaxVp = mapSettings.maxVp;
        mapSettings.minVp = vpValuesLocal[vpRange[0]];
        mapSettings.maxVp = vpValuesLocal[vpRange[1]];
        if (lastMaxVp == 0) lastMaxVp = mapSettings.maxVp;
    }

    //

    const getVp = (min: boolean) => {
        let check = vpValues[vpValues.length - 1];
        const vp = vpValues.filter((v) => {
            const distance = Math.abs((min ? lastMinVp : lastMaxVp) - v);
            if (distance <= check) {
                check = distance;
                return true;
            }
        });
        return vpValues.indexOf(vp[vp.length - 1]);
    };

    const fixRange = () => {
        vpRange = [getVp(true), getVp(false)];
        return "";
    };

    const areaFormatter = (value: number) => {
        return areaLengths[value].name;
    };

    const vpFormatter = (value: number) => {
        return vpValues[value].toString();
    };

    //

    function filterMap(name: string) {
        if (mapSettings.bannedMaps.includes(name)) {
            mapSettings.bannedMaps = mapSettings.bannedMaps.filter(
                (map) => map !== name,
            );
        } else {
            mapSettings.bannedMaps = [...mapSettings.bannedMaps, name];
        }
    }

    function filterHero(name: string) {
        if (heroSettings.filteredHeroes.includes(name)) {
            heroSettings.filteredHeroes = heroSettings.filteredHeroes.filter(
                (hero) => hero !== name,
            );
        } else {
            heroSettings.filteredHeroes = [
                ...heroSettings.filteredHeroes,
                name,
            ];
        }
    }

    //

    function onFilterButtonMouseEventMap(e: MouseEvent, name: string) {
        if (e.buttons === 1) {
            filterMap(name);
        }
    }

    function onFilterButtonMouseEventHero(e: MouseEvent, hero: HeroData) {
        if (e.buttons === 1) {
            filterHero(hero.name);
        }
    }

    //

    interface AreaLength {
        name: string;
        min: number;
        max: number;
    }

    const areaLengths: AreaLength[] = [
        { name: "tiny", min: 8, max: 15 },
        { name: "short", min: 16, max: 28 },
        { name: "normal", min: 38, max: 43 },
        { name: "long", min: 54, max: 80 },
        { name: "huge", min: 400, max: 480 },
    ];
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
                <input
                    type="checkbox"
                    bind:checked={mapSettings.includeHardMaps}
                />
            </label>

            <div>
                <p>
                    Area Count: {mapSettings.minAreas} - {mapSettings.maxAreas}
                </p>
                <div class="slider">
                    <RangeSlider
                        min={0}
                        max={areaLengths.length - 1}
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

            {#key areaRange}
                {fixRange()}
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
            {/key}

            <div class="filter">
                <p>Custom filter:</p>
                <button on:click={() => mapFilterModal.showModal()}>
                    {mapFilterText}
                </button>
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

            <div class="filter">
                <p>Custom filter:</p>
                <button on:click={() => heroFilterModal.showModal()}>
                    {heroFilterText}
                </button>
            </div>
        {/if}
    </div>
</div>

<dialog class="filter-modal" bind:this={mapFilterModal}>
    <form method="dialog">
        <button type="submit">Close</button>
    </form>
    <div class="filter-settings">
        <button on:click={() => (mapSettings.bannedMaps = [])}>All</button>
        <button
            on:click={() =>
                (mapSettings.bannedMaps = maps.map((m) => m.short_name))}
        >
            None
        </button>
    </div>
    <div class="filter-list">
        {#each maps as map}
            <button
                class:filtered={mapSettings.bannedMaps.includes(map.short_name)}
                style="background-color: {map.color};"
                on:mousedown={(e) =>
                    onFilterButtonMouseEventMap(e, map.short_name)}
                on:mouseenter={(e) =>
                    onFilterButtonMouseEventMap(e, map.short_name)}
            >
                {map.short_name.toUpperCase()}
                {#if mapSettings.bannedMaps.includes(map.short_name)}
                    <div class="filter-mark">
                        <Plus />
                    </div>
                {/if}
            </button>
        {/each}
    </div>
</dialog>

<dialog class="filter-modal" bind:this={heroFilterModal}>
    <form method="dialog">
        <button type="submit">Close</button>
    </form>
    <div class="filter-settings">
        <button on:click={() => (heroSettings.filteredHeroes = [])}>All</button>
        <button
            on:click={() =>
                (heroSettings.filteredHeroes = heroes.map((h) => h.name))}
        >
            None
        </button>
    </div>
    <div class="filter-list">
        {#each heroes as hero}
            <button
                class:filtered={heroSettings.filteredHeroes.includes(hero.name)}
                style="background-color: {hero.color};"
                on:mousedown={(e) => onFilterButtonMouseEventHero(e, hero)}
                on:mouseenter={(e) => onFilterButtonMouseEventHero(e, hero)}
            >
                {hero.name}
                {#if heroSettings.filteredHeroes.includes(hero.name)}
                    <div class="filter-mark">
                        <Plus />
                    </div>
                {/if}
            </button>
        {/each}
    </div>
</dialog>

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

    @media (max-width: 450px) {
        .settings {
            width: 100%;
        }

        .settings-section {
            width: 100%;
        }
    }

    .filter {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .filter-modal {
        z-index: 10;
    }

    .filter-settings {
        margin: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .filter-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
    }

    .filter-list button {
        position: relative;

        font-weight: bold;
        text-shadow: #000000 0px 0px 3px;

        font-size: 1.2rem;

        overflow: hidden;

        border: none;
    }
    .filter-list button.filtered {
        filter: saturate(0.5) brightness(0.5);
    }

    .filter-mark {
        position: absolute;
        top: -18px;
        right: -18px;
        background-color: red;
        width: 40px;
        height: 40px;

        display: flex;
        justify-content: center;
        align-items: end;

        transform: rotate(45deg);
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
