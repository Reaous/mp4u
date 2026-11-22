<script>
import { createRawSnippet, onMount } from "svelte";
import { db } from "../lib/db";

    let savedvids = $state([]);
    let stream = $state()
    let mediarecorder
    let isrecording = $state(false);
    let chunks = [];
    let videobox = $state()
    let showvideo = $state(false)


    const camon = (async ()=> {
    stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    showvideo = true
    }) 

    const camoff = (async ()=> {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = undefined ;
        }
        showvideo= false
    })



    $effect(() => {
    if (videobox && stream) {
        videobox.srcObject = stream;
    }
    });

 
    const startrecording = ()=> {
        console.log("Start clicked")
        chunks = []
        mediarecorder=new MediaRecorder(stream)
        mediarecorder.ondataavailable = (e)=> {
        chunks.push(e.data)
        }

        mediarecorder.onstop = async ()=> {
        const blob = new Blob(chunks ,{type :"video/webm"})
        await db.videos.add({ createdat: Date.now(), video:blob});
    }


        mediarecorder.start();
        isrecording = true


    }



    const stoprecording = ()=> {
        console.log("stop cickd")
        mediarecorder.stop();
        isrecording=false

    }
    


</script>

<div class="w-full max-w-m flex flex-col items-center gap-4 text-white">
{#if showvideo}
<div >
<video autoplay playsinline muted bind:this= {videobox} class = "bg-black" >
    
</video>
</div>
<div class = "flex gap-4">

<button onclick={startrecording} disabled={isrecording} class = "px-10 py-10 rounded bg-red-500 text-white disabled:opacity-30">
 Start the recording :D
</button>



<button onclick={stoprecording} disabled = {!isrecording} class = "px-5 py-3 rounded bg-red-700 text-white disabled:opacity-30">
    Stop recording? 
</button>

{#if isrecording}
    <h1> Recording underway :3</h1>
{/if}

</div>


<button onclick ={camoff} class="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded bg-blue-600 text-white ">
    Go back to homepage? 
</button>
{/if}

</div>

{#if !showvideo}
<button onclick={camon} class="px-4 py-2 rounded bg-purple-900 text-white" >
    Want to create some journals ? 
</button>
{/if}

<a href="/gallery" class = "fixed bottom-4 left-1/4 -transalate-x-1 px-4 py-2 rounded bg-green-700 text-white" >  view gallery </a>
