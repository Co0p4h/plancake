<script lang="ts">
  import {LayoutDashboard, Palette, CaseSensitive, Image, LayoutList, StretchHorizontal, Paintbrush} from "@lucide/svelte";
  import NavIcon from "./NavIcon.svelte";

  let { activeAppearance = $bindable() } = $props();

  const appearanceTabs = ['image', 'layout', 'typography', 'background', 'id', 'colours', 'item-theme'];

  const handleNavClick = (activeAppearanceTab: string) => {
    window.location.hash = activeAppearanceTab;
    activeAppearance = activeAppearanceTab
  };

  $effect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && appearanceTabs.includes(hash)) {
        activeAppearance = hash;
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  })
</script>

<div class="p-2.5 bg-white border border-gray-300 rounded-lg">
  <div class="gap-4 flex flex-col items-start">
    <button onclick={() => handleNavClick("layout")} class="cursor-pointer">
      <NavIcon active={activeAppearance === "layout"}>
        <LayoutDashboard />
      </NavIcon>
    </button>
    <button onclick={() => handleNavClick("colours")} class="cursor-pointer">
      <NavIcon active={activeAppearance === "colours"}>
        <Palette />
      </NavIcon>
    </button>
    <button onclick={() => activeAppearance = "typography"} class="cursor-pointer">
      <NavIcon active={activeAppearance === "typography"}>
        <CaseSensitive />
      </NavIcon>
    </button>
    <button onclick={() => activeAppearance = "item"} class="cursor-pointer">
      <NavIcon active={activeAppearance === "item"}>
        <LayoutList />
        <!-- <StretchHorizontal /> -->
      </NavIcon>
    </button>
    <button onclick={() => activeAppearance = "background"} class="cursor-pointer">
      <NavIcon active={activeAppearance === "background"}>
        <Paintbrush />
      </NavIcon>
    </button>
    <button onclick={() => activeAppearance = "image"} class="cursor-pointer">
      <NavIcon active={activeAppearance === "image"}>
        <Image />
      </NavIcon>
    </button>
  </div>
</div>