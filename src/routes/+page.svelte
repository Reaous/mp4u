<script>
import { onMount } from "svelte";
    let stream
    let mediarecorder
    let isrecording = false;
    let chunks = []
    let videobox
 
    const startrecording = ()=> {
        chunks = []
        mediarecorder=new MediaRecorder(stream)
        mediarecorder.ondataavailable = (e)=> {
        chunks.push(e.data)
        }

        mediarecorder.onstop = ()=> {
        const blob = new Blob(chunks ,{type :"video/webm"})
    }

        mediarecorder.start();
        isrecording = true


    }

    const stoprecording = ()=> {
        mediarecorder.stop();
        isrecording=false

    }

    const recordtoggle = () => {
        if (isrecording=== false){startrecording}
        else{isrecording=false}
    }


    onMount (async ()=> {
        const videostream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
        videobox.srcObject = stream
    }) 

</script>


<video autoplay playsinline muted bind:this= {videobox} class = "bg-black" >

</video>


<button onclick={recordtoggle}>
Start the recording :D
</button>