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
{#if showvideo}
<div >
<video autoplay playsinline muted bind:this= {videobox} class = "bg-black" >
    
</video>
</div>
<div class = "flex gap-4">

<button onclick={startrecording} disabled={isrecording}>
| Start the recording :D
</button>

<div> | </div>

<button onclick={stoprecording} disabled = {!isrecording}>
    Stop recording? |
</button>

{#if isrecording}
    <h1> Recording underway :3</h1>
{/if}

</div>

<button onclick ={camoff}>
    Go back to homepage? 
</button>
{/if}

{#if !showvideo}
<button onclick={camon}>
    Want to create some journals ? 
</button>
{/if}

<a href="/gallery">  view gallery </a>
