<ModalMain close={close} text="Add a new photo" >
    {#if !progress}    
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div ondrop={drop} ondragover={e => e.preventDefault()} ondragenter={e => e.preventDefault()} class="width-full flex flex-col p-5 gap-5">
            <div class="flex flex-col gap-2 font-semibold">
                <label for="label" class="text-md w-fit">Label</label>
                <input type="text" id="label"
                bind:value={labelText}
                class="outline-2 placeholder-shown:truncate focus:placeholder:text-transparent outline-gray-300 rounded-lg p-4 w-full text-sm"
                placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae veniam fuga itaque laborum quas placeat voluptate saepe qui ullam nisi vitae alias iusto, similique ratione velit ad eos animi excepturi?" 
                >
            </div>
            <div class="flex justify-center align-center gap-5 h-[60px]">
                <button onclick={() => inputRef?.click()} class="bg-[#318CE7] w-[220px] h-full text-white font-thin text-2xl rounded-2xl flex justify-center items-center shadow-md cursor-pointer">
                    Select a file
                </button>
                <div class="h-full flex flex-col justify-center items-center">
                    <h3 class="text-center text-xl">Or drop file on this modal</h3>
                </div>
            </div>
            <input onchange={change} bind:this={inputRef} class="hidden" type="file" accept="image/*">
        </div>
        {:else}
        <div>
            <div class="p-5">
                <div class="mb-1 text-base font-medium dark:text-white">Upload</div>
                <div class="w-full bg-gray-200 rounded-full">
                    <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={`width: ${progress}%`}> { progress }%</div>
                </div>
            </div>
        </div>
    {/if}
</ModalMain>

<script lang="ts">
	import axios from "axios";
    import ModalMain from "./modalMain.svelte";
    const isImage = /^image\//
    let inputRef: HTMLInputElement|null = $state(null)
    let progress = $state(0)
    let labelText:string = $state('')
    let { close, append }:{close: () => void, append: ({label,link,id}:{label:string,link:string, id:string}) => void} = $props()
    const drop = async (e:DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer?.files?.[0]
        if(!file) return alert("No file selected")
        if(!isImage.test(file.type)) return alert('Wrong filetype')
        if(!labelText.length) return alert('Fill label first')
        await upload(file)
    }
    const change = async (e:Event) => {
        const fileInput = e.target as HTMLInputElement
        console.log(labelText)
        const file = fileInput.files?.[0]
        fileInput.value = ''
        if(!file) return alert("Cant process file")
        if(!isImage.test(file.type)) return alert("Wrong file type")
        if(!labelText.length) return alert('Fill label first')
        await upload(file)
    }
    async function upload(file:File) {
        const data = new FormData()
        data.append('image', file)
        data.append('label', labelText)
        const res = await axios.post('/api/images', data, {
        headers: {
            'Accept': 'application/json'
        },
        onUploadProgress: (e) => {
            if(!e.progress) return
            progress = Math.round(e.progress * 100)
        }
        }).catch(err => {
            console.error(err)
            alert('imgur upload error')
        }) as {data:{link:string,id:string}}
        progress = 0
        if(res.data?.id&&res.data?.link)
            append({
                label: labelText,
                link: res.data.link,
                id: res.data.id
            })
        else close()
    }
</script>