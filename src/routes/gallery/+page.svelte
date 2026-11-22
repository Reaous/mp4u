<script>
    import { onMount } from "svelte";
    import { db } from "#lib/db.js";

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
        const rows = await db.videos.toArray();
        let temp = [];
        for (const row of rows){
            temp.push({id : row.id ,createdat :row.createdat, url:URL.createObjectURL(row.video)})
        }
        savedvids = temp;
    }




</script>
{#if savedvids.length !== 0}
    <div class= "grid grid-cols-4 gap-4 " >
        {#each savedvids as video (video.id) }

            <div class ="flex flex-col gap-2">
                <p>
                    <video src={video.url} controls  >
                        <track kind="captions" />
                    </video>
                </p>

                <button onclick ={() => deletesavedvideo(video.id)}>
                    Delete recording?
                </button>
            </div>
        {/each}
    </div>       
{:else}
            <div>
                <h1> No journals found D: . Go vlog some more !</h1>
            </div>
    
{/if}
   
<div>
<div> </div>
    <a href= "/" > go back to home</a>
</div>

