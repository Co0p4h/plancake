<script>
	import { LogOut, Settings } from "@lucide/svelte";
  let { menuHovered = $bindable() } = $props();
</script>

<div class="absolute right-0 rounded-lg border border-gray-300 bg-white z-10 px-4 py-3 shadow-lg top-7 w-max"
      role="button"
      tabindex="0"
      onmouseenter={() => {
        menuHovered = true;
      }}
      onmouseleave={() => {
        menuHovered = false;
      }}
>	
  <div class="hover:bg-gray-100 items-center gap-x-2 px-2 py-1 flex rounded-md duration-200 ">
    <a href="/account" class="w-full flex items-center gap-2">
      <Settings size={20} />
      account settings
    </a>
  </div>
  <div class="text-red-500 hover:bg-gray-100 flex items-center gap-x-2 rounded-md px-2 py-1 text-left duration-200">
    <button class="flex items-center gap-2 cursor-pointer w-full" onclick={async () => {
                    const response = await fetch("/logout", { method: "POST" });
                    console.log("logout response", response);
                    
                    if (response.ok) {
                        window.location.href = "/";
                    } else {
                        console.error("Logout failed");
                    }
                  }}>
      <LogOut size={18} />
      logout
    </button>
  </div>
</div>