<script>
import { onMount } from "svelte";
    let stream
    let mediarecorder
    let isrecording = false;
    let chunks = [];
    let videobox
    let finalvideo=$state(null);

    onMount (async ()=> {
    stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    videobox.srcObject = stream
    }) 

 
    const startrecording = ()=> {
        console.log("Start clicked")
        chunks = []
        mediarecorder=new MediaRecorder(stream)
        mediarecorder.ondataavailable = (e)=> {
        chunks.push(e.data)
        }

        mediarecorder.onstop = ()=> {
        const blob = new Blob(chunks ,{type :"video/webm"})
        finalvideo=URL.createObjectURL(blob)    
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


<button onclick={startrecording}>
Start the recording :D
</button>

<button onclick={stoprecording}>
    Stop recording 
</button>

{#if finalvideo}
    <video src={finalvideo} controls>

    </video>
{/if}