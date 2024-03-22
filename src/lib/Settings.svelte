<script lang="ts">
    export let includeHardMaps: boolean = false;
</script>

<div class="settings">
    <h1>Map selection</h1>

    <label>
        Include hard maps
        <input type="checkbox" bind:checked={includeHardMaps} />
    </label>

    <h1>Hero selection</h1>
</div>

<style>
    .settings {
        width: 400px;
        min-height: 200px;

        font-size: 1.1rem;

        display: flex;
        flex-direction: column;
        gap: 10px;

        background-color: var(--element-bg-color);
        border-radius: 10px;
        padding: 20px;
    }

    h1 {
        font-weight: normal;
        font-size: 1.5rem;
        padding: 0;
    }
</style>
