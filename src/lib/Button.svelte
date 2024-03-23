<script lang="ts">
    export let onClick: () => void = () => {};
</script>

<button on:click={onClick}>
    <slot />
</button>

<style>
    button {
        font-size: 1.2rem;
    }
</style>
