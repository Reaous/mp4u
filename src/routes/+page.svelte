<script>
import { createRawSnippet, onMount } from "svelte";
import { db } from "../lib/db";

    let savedvids = $state([]);
    let stream
    let mediarecorder
    let isrecording = false;
    let chunks = [];
    let videobox


    onMount (async ()=> {
    stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    videobox.srcObject = stream
    await loadvideos()
    }) 


 
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


<a href="/gallery">  view gallery </a>
