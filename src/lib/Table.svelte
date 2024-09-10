<script lang="ts">
    import { Circle } from "lucide-svelte";
    import { heroes } from "../data/heroes";
    import { maps } from "../data/maps";
    import { onMount } from "svelte";

    let tableData: boolean[][];

    onMount(() => {
        load();

        window.onbeforeunload = () => {
            save();
        };
    });

    function save() {
        localStorage.setItem("tableData", JSON.stringify(tableData));
    }

    function load() {
        let storageItem = localStorage.getItem("tableData");
        if (storageItem) {
            tableData = JSON.parse(storageItem);
        } else {
            createTable();
        }
    }

    function createTable() {
        tableData = [];
        for (let i = 0; i < maps.length; i++) {
            let row = [];
            for (let j = 0; j < heroes.length; j++) {
                row.push(false);
            }
            tableData.push(row);
        }
    }
</script>

<div class="table">
    {#if tableData}
        <div
            class="grid"
            style="--cols: {heroes.length}; --rows: {maps.length};"
        >
            <div class="row">
                <div class="item header"></div>
                {#each heroes as hero, hId}
                    <div class="item hero-header" style=";">
                        <Circle color={hero.color} />
                    </div>
                {/each}
            </div>

            {#each maps as map, mId}
                <div class="row">
                    <div class="item header" style="color: {map.color};">
                        {map.name}
                    </div>

                    {#each heroes as hero, hId}
                        <div class="item">
                            <label class="checkbox-container">
                                <input
                                    type="checkbox"
                                    bind:checked={tableData[mId][hId]}
                                />
                                <div
                                    class="checkbox"
                                    style="border-color: {hero.color}; --fill-bg: {hero.color};"
                                ></div>
                            </label>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .table {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 20px;
    }

    .grid {
        display: grid;
        grid-template-rows: repeat(var(--rows), 1fr);

        place-items: center;
    }

    .row {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .item {
        width: 30px;
        height: 30px;
    }

    .header {
        font-weight: bold;
        width: 280px;

        display: flex;
        justify-content: start;
        align-items: center;

        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .checkbox-container {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkbox {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        background-color: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }

    .checkbox:hover {
        background-color: rgba(255, 255, 255, 0.3);
        filter: brightness(1.2);
    }

    input:not(:checked) ~ .checkbox {
        filter: brightness(0.5);
    }

    input:checked ~ .checkbox {
        background-color: var(--fill-bg);
    }

    .row:has(input:hover) .header {
        background-color: rgba(255, 255, 0, 0.2);
    }
</style>
