<script lang="ts">
  let { active, children } = $props();
</script>

<div class={`${active ? "bg-purple-bg text-purple-text" : "bg-white text-gray-500 hover:bg-gray-100"} p-1.5 rounded-lg `}>
  {@render children()}
</div>
