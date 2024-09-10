<script lang="ts">
    import Grid_3x3 from "lucide-svelte/icons/grid-3x3";
    import Generator from "./lib/Generator.svelte";
    import { Dices } from "lucide-svelte";
    import Table from "./lib/Table.svelte";

    let showTable: boolean = false;
</script>

<header>
    <h1 class="title">Evades Runs Generator</h1>
    <div class="nav">
        <button
            class:selected={!showTable}
            on:click={() => (showTable = false)}
        >
            <Dices />
            <span>Generator</span>
        </button>
        <button class:selected={showTable} on:click={() => (showTable = true)}>
            <Grid_3x3 />
            <span>Progress Table</span>
        </button>
    </div>
</header>
<main>
    {#if showTable}
        <Table />
    {:else}
        <Generator />
    {/if}
</main>
<footer>
    <p class="made-by">
        Made by
        <a class="elox" href="https://github.com/elox5" target="_blank">
            elOx
        </a>
        and
        <a class="bonsix" href="https://github.com/bonsix" target="_blank">
            Bonsix
        </a>
    </p>
    <p class="evades-link">
        <a class="evades" href="https://evades.io" target="_blank">evades.io</a>
    </p>
    <a class="source" href="https://github.com/elox5/evades-runs">Source</a>
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

    .made-by,
    .evades-link,
    .source {
        flex: 1;
    }

    .made-by {
        text-align: left;
    }

    .source {
        text-align: right;
    }

    header {
        position: sticky;
        top: 0px;
        z-index: 100;
    }

    .nav {
        display: flex;
        gap: 10px;
    }

    .nav > button {
        display: flex;
        gap: 5px;
        align-items: center;
        font-size: 1.1rem;
        padding: 10px;
    }

    .nav > button.selected {
        color: #80ff80;
    }

    main {
        width: 100%;
        min-height: calc(100vh - 140px);

        padding: 20px;

        display: grid;
        place-items: center;
        gap: 20px;
    }

    @media (max-width: 450px) {
        header h1 {
            font-size: 1.5rem;
        }

        main {
            padding: 10px;
        }
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
