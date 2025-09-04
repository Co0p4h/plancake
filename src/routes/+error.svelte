<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="my-auto flex items-center justify-center min-h-svh">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">{page.error?.message}</h1>
  </div>
</div>