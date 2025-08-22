<script lang="ts">
  let { toggled = $bindable(), disabled, onclick }: { toggled: boolean, disabled: boolean, onclick: () => void } = $props();
</script>

<button
  class={`
    relative inline-flex items-center h-[23px] rounded-full min-w-10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
    ${toggled ? "bg-purple-500" : "bg-gray-300"} 
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
  disabled={disabled}
  type="button"
  onclick={() => {
    if (!disabled) {
      onclick();
    }
  }}
>
   <span class="sr-only">{toggled ? "Enabled" : "Disabled"}</span>
   <span class={`${toggled ? "translate-x-[19px]" : "translate-x-[1.5px]" } inline-block w-[19px] h-[19px] transform bg-white rounded-full transition-transform`}></span>
</button>
