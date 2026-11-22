<script>
import { createRawSnippet, onMount } from "svelte";
import { db } from "../lib/db";

    let savedvids = $state([]);
    let stream
    let mediarecorder
    let isrecording = false;
    let chunks = [];
    let videobox
    let finalvideo=$state(null);

    onMount (async ()=> {
    stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    videobox.srcObject = stream
    await loadvideos()
    }) 

    const loadvideos = async ()=> {
        const rows = await db.videos.toArray();
        let temp = [];
        for (const row of rows){
            temp.push({id : row.id ,createdat :row.createdat, url:URL.createObjectURL(row.video)})
        }
        savedvids = temp;
    }

 
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
        await loadvideos()
        finalvideo=URL.createObjectURL(blob)    
    }


        mediarecorder.start();
        isrecording = true


    }

    const deletesavedvideo = async (videoid) => {
        await db.videos.delete(videoid)
        await loadvideos()



    }

    const stoprecording = ()=> {
        console.log("stop cickd")
        mediarecorder.stop();
        isrecording=false

    }


</script>


<video autoplay playsinline muted bind:this= {videobox} class = "bg-black" >

</video>

<div class = "flex gap-4">

<div></div>
<button onclick={startrecording}>
| Start the recording :D
</button>

<div> | </div>

<button onclick={stoprecording}>
    Stop recording? |
</button>


</div>

{#if finalvideo}
    <video src={finalvideo} controls>

    </video>
{/if}

{#each savedvids as video (video.id) }
<div>
    <button onclick ={() => deletesavedvideo(video.id)}>
        Delete recording?
    </button>
</div>
    <video src={video.url} controls >

    </video>
{/each}