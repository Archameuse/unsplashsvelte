<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<aside
onmousedown={close}
class="w-full h-full fixed z-50 top-0 left-0 bg-[#00000079] flex items-center justify-center"
>
<div
    onmousedown={(e) => e.stopPropagation()}
    class="bg-white rounded-md text-primary w-screen max-w-2xl max-h-screen p-4 overflow-y-auto flex flex-col gap-4 relative"
>
    <div class="flex justify-between w-full max-w-full items-center select-none border-b">
        <h1 class="text-2xl font-mono font-semibold break-words overflow-hidden">{ text }</h1>
        <button
        onclick={close}
            class="h-8 min-w-8 aspect-square cursor-pointer hover:opacity-80 active:opacity-95 transition-all"
            >
            X
        </button>
    </div>
    {@render children()}
</div>
</aside>
<script lang="ts">
	import { onDestroy, onMount, type Snippet } from "svelte";

// const dispatch = createEventDispatcher()
let { close, text, children}:{close: () => void, text:string, children:Snippet<[]>} = $props()

onMount(() => {
    if(typeof document !== 'undefined')
    document.body.style.overflowY = 'hidden'
})

onDestroy(() => {
    if(typeof document !== 'undefined') 
    document.body.style.overflowY = 'auto'
    
})
</script>
