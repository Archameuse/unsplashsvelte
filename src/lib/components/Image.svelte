<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if show}
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
onclick={() => showImageModal=true}
class={"group h-full w-full rounded-2xl shadow-md overflow-hidden border cursor-pointer relative break-inside-avoid bg-black"+
    (ratio===0?'':ratio===1?" [grid-row:span_2]":" [grid-column:span_2]")
}
>
<img alt={name} src={src} class="w-full h-full object-cover group-hover:opacity-70">
<button onclick={openDelModal} class="absolute cursor-pointer hidden group-hover:block py-1 top-5 right-10 w-24 border-solid border border-[salmon] text-[salmon] rounded-2xl">delete</button>
</div>
{#if showImageModal}
    <ModalImage name={name} src={src} close={() => showImageModal=false}/>
{/if}
{#if showDelModal}
    <ModalDel close={() => showDelModal=false} del={del} name={name} loading={delLoading}/>
{/if}
{/if}

<script lang="ts">
	import { onMount } from "svelte";
	import ModalImage from "./modalImage.svelte";
	import ModalDel from "./modalDel.svelte";
	import axios from "axios";
    let {src, id, name="Default image", remove}:{src:string,id:string,name?:string, remove:(id:string) => void} = $props()
    let show:boolean = $state(false)
    let showImageModal:boolean = $state(false)
    let showDelModal:boolean = $state(false)
    // let ratio = Math.floor(Math.random()*3)
    let ratio:number = $state(0)
    let delLoading:boolean = $state(false)
    onMount(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            const range = 0.05
            const calc = img.naturalWidth / img.naturalHeight
            if(calc < (1-range)) ratio = 1
            else if(calc < (1+range)) ratio = 0
            else ratio = 2
            show = true
        }
        img.onerror = (e) => console.log(e)
    })
    const openDelModal = (e:MouseEvent) => {
        e.stopPropagation()
        showDelModal = true
    }
    const del = async () => {
        delLoading = true
        await axios.delete('/api/images', {
            data: {
                id
            }
        }).then(() => {
            delLoading = false
            remove(id)
            showDelModal = false
        }).catch(e => {
            delLoading = false
            alert('Error deleting image')
        })
    }
</script>