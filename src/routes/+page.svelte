<main class="w-screen max-w-3xl m-auto flex flex-col h-96 mt-8 px-4">
    <header class="w-full flex justify-between flex-wrap gap-2">
        <div class="flex flex-wrap gap-2 justify-center">
            <img alt="My-unsplash logo" src="/my_unsplash_logo.svg" class="w-40 md:w-60">
            <div class="flex justify-between rounded-lg p-2 shadow-md border-2 border-solid border-[rgba(0,0,0,0.2)]">
                <img src="/search.svg" alt="" aria-hidden="true" class="opacity-30 h-6 aspect-square">
                <input bind:value={search} type="search"  placeholder="Search by name" class="ml-4 border-none focus:border-none focus:outline-none placeholder:text-[rgba(0,0,0,0.3)] text-sm">
             </div>
        </div>
        <button onclick={() => showModal = true} class="text-white bg-[#219654b9] text-sm min-w-[10rem] h-12 rounded-lg shadow-md cursor-pointer flex justify-center items-center mx-auto">Add a photo</button>
    </header>
    <section class="py-14 w-full grid grid-cols-1 [@media(width>=20rem)]:grid-cols-2 [@media(width>=35rem)]:grid-cols-3 [@media(width>=45rem)]:grid-cols-4 gap-4 grid-flow-dense">
        {#each images.filter(img => img.label.includes(search)) as image}
            <Image src={image.link} id={image.id} name={image.label} remove={remove}/>
        {/each}
    </section>
</main>
{#if showModal}
    <ModalAdd close={() => showModal = false} append={append}/>
{/if}

<script lang="ts">
	import Image from "$lib/components/Image.svelte";
    import ModalAdd from "$lib/components/modalAdd.svelte";
	import axios from "axios";
	import { onMount } from "svelte";

    interface ImageInt {
        label: string,
        link: string,
        id: string
    }

    let images:ImageInt[] = $state([])
    let showModal = $state(false)
    let search = $state('')

    onMount(async () => {
        await axios.get('/api/images').then(data => images = data.data as ImageInt[])
    })
    

    const append = (img:ImageInt) => {
        images.push(img)
        showModal = false
    }
    const remove = (id:string) => {
        images = images.filter(img => img.id!==id)
    }
</script>