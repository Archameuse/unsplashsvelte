<ModalMain close={close} text={'Delete '+name}>
    {#if !loading}
    <div class="w-full flex justify-end p-5">
        <div class="flex flex-row-reverse gap-5">
            <button onclick={del} class="text-white bg-[salmon] text-md w-28 h-12 rounded-lg shadow-md cursor-pointer flex justify-center items-center">Delete</button>
            <button onclick={close} class="text-gray-500 cursor-pointer h-12 test-md w-20">Cancel</button>
        </div>
    </div>
    {:else}
    <div class="w-full p-5 flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 3a9 9 0 1 0 9 9"/>
        </svg>
    </div>
    {/if}
</ModalMain>
<script lang="ts">
	import ModalMain from "./modalMain.svelte";
let { close, del, name,loading}:{close: () => void, del: () => void, name:string, loading?:boolean} = $props()

</script>