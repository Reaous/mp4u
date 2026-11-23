<script>
    import { onMount } from "svelte";
    import { db } from "#lib/db.js";
    import bg from "#lib/assets/bg.png"

    onMount (async () => {
        await loadvideos();
    })

    let savedvids =$state([]);
    let videothere = Boolean;

    const deletesavedvideo = async (videoid) => {
        await db.videos.delete(videoid)
        await loadvideos()
    }

    const loadvideos = async ()=> {
        const rows = await db.videos.orderBy("createdat").reverse().toArray();
        let temp = [];
        for (const row of rows){
            temp.push({id : row.id ,createdat :row.createdat, url:URL.createObjectURL(row.video)})
        }
        savedvids = temp;
    }




</script>


<div style ="background-image:url({bg})" class = "bg-fixed min-h-screen w-full bg-cover bg-center bg-no-repeat p-6 pb-20">
{#if savedvids.length !== 0}
    <div class= "grid grid-cols-4 gap-4 " >
        {#each savedvids as video (video.id) }

            <div class ="flex flex-col gap-2">
            <p class = "text-sm text-white bg-black px-2 py-1 rounded">
                {new Date(video.createdat).toLocaleString()}
            </p>
                <p>
                    <video src={video.url} controls  >
                        <track kind="captions" />
                    </video>
                </p>

                <button onclick ={() => deletesavedvideo(video.id)} class =" py-2 rounded bg-red-600 text-white"> 
                    Delete recording?
                </button>
            </div>
        {/each}
    </div>       
{:else}
            <div>
                <h1 class = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded bg-purple-500 text-white"> No journals found D: . Go vlog some more !</h1>
            </div>
    
{/if}
   
<div class = "fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded bg-blue-800 text-white " >
    <a href= "/" > go back to home </a>
</div>

</div>
