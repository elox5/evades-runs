<script lang="ts">
  import Button from "./lib/Button.svelte";
  import ListDisplay from "./lib/ListDisplay.svelte";
  import Settings from "./lib/Settings.svelte";
  import type {
    GenerationSettings,
    HeroSettings,
    MapSettings,
  } from "./lib/settings";

  let generationSettings: GenerationSettings;
  let mapSettings: MapSettings;
  let heroSettings: HeroSettings;

  let list: string[] = [];
</script>

<header>
  <h1 class="title">Evades Runs Generator</h1>
</header>
<main>
  <Settings bind:mapSettings></Settings>
  <Button>Generate!</Button>
  <hr />
  <ListDisplay {list}></ListDisplay>
</main>
<footer>
  <p>
    Made by <a class="elox" href="https://github.com/elox5" target="_blank"
      >elOx</a
    >
    and
    <a class="bonsix" href="https://github.com/bonsix" target="_blank">Bonsix</a
    >
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
