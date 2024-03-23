<script lang="ts">
    import type { MapData } from "../data/maps";

    export let map: MapData;
    export let list: string[];
    export let generateNothing: boolean;
</script>

<div class="element">
    <div class="list">
        {#if generateNothing}
            <div class="placeholder">What did you expect to happen?</div>
        {:else if list.length === 0}
            <div class="placeholder">Generated run goes here...</div>
        {:else}
            {#each list as item, index}
                <span>{item}</span>

                {#if index < list.length - 1}
                    <span class="bullet">•</span>
                {/if}
            {/each}
        {/if}
    </div>
</div>

<style>
    .list {
        width: 400px;
        min-height: 200px;

        font-size: 1.5rem;

        display: flex;
        flex-direction: column;

        background-color: var(--element-bg-color);
        border-radius: 10px;
        padding: 20px;
    }

    .bullet {
        margin: 10px;
    }

    .placeholder {
        width: 100%;
        height: 160px;

        display: grid;
        place-items: center;

        color: #ffffff77;
    }
</style>
