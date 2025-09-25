<script lang="ts">
  import {LayoutDashboard, Palette, CaseSensitive, Image, LayoutList, StretchHorizontal, Paintbrush} from "@lucide/svelte";
  import NavIcon from "./NavIcon.svelte";
  import { m } from '$lib/paraglide/messages.js';

  let { activeAppearance = $bindable() } = $props();

  const appearanceTabs = ['image', 'layout', 'typography', 'background', 'colours', 'item'];

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
    <button onclick={() => handleNavClick("layout")} class="cursor-pointer" title={m["_appearance._tooltips.layout_settings"]()}>
      <NavIcon active={activeAppearance === "layout"}>
        <LayoutDashboard />
      </NavIcon>
    </button>
    <button onclick={() => handleNavClick("colours")} class="cursor-pointer" title={m["_appearance._tooltips.colour_settings"]()}>
      <NavIcon active={activeAppearance === "colours"}>
        <Palette />
      </NavIcon>
    </button>
    <button onclick={() => handleNavClick("typography")} class="cursor-pointer" title={m["_appearance._tooltips.typography_settings"]()}>
      <NavIcon active={activeAppearance === "typography"}>
        <CaseSensitive />
      </NavIcon>
    </button>
    <button onclick={() => handleNavClick("item")} class="cursor-pointer" title={m["_appearance._tooltips.item_settings"]()}>
      <NavIcon active={activeAppearance === "item"}>
        <LayoutList />
        <!-- <StretchHorizontal /> -->
      </NavIcon>
    </button>
    <button onclick={() => handleNavClick("background")} class="cursor-pointer" title={m["_appearance._tooltips.background_settings"]()}>
      <NavIcon active={activeAppearance === "background"}>
        <Paintbrush />
      </NavIcon>
    </button>
    <button onclick={() => handleNavClick("image")} class="cursor-pointer" title={m["_appearance._tooltips.image_settings"]()}>
      <NavIcon active={activeAppearance === "image"}>
        <Image />
      </NavIcon>
    </button>
  </div>
</div>