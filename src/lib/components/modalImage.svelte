<ModalMain text={name} close={close}>
    <div class="w-full overflow-y-auto">
        <img src={src} class="w-full object-contain" alt={name}/>
    </div>
<!-- <div>asdasd</div> -->
</ModalMain>

<script lang="ts">
    import ModalMain from "./modalMain.svelte";
let { close, name, src}:{close: () => void, name:string, src:string} = $props()

</script>