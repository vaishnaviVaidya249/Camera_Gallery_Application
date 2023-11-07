setTimeout(()=>{
    if(db){
        //video reteiveal
        
        let dbTransaction=db.transaction("video","readonly");
        let videoStore=dbTransaction.objectStore("video");
        let videoRequest=videoStore.getAll();//event driven
        videoRequest.onsuccess=(e)=>{
            let videoResult=videoRequest.result;
            let galleryCont=document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj)=>{
                let mediaEle=document.createElement("div");
                mediaEle.setAttribute("class","media-cont");
                mediaEle.setAttribute("id",videoObj.id);
                let url=URL.createObjectURL(videoObj.blobData);

                mediaEle.innerHTML=`
                <div class="media">
                   <video  autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `;
                galleryCont.appendChild(mediaEle);


                let deleteBtn=mediaEle.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);
                let downloadBtn=mediaEle.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
                

            })
        }
        //image retriveal
        let imagedbTransaction=db.transaction("image","readonly");
        let imageStore=imagedbTransaction.objectStore("image");
        let imageRequest=imageStore.getAll();//event driven
        imageRequest.onsuccess=(e)=>{
            let imageResult=imageRequest.result;
            let galleryCont=document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj)=>{
                let mediaEle=document.createElement("div");
                mediaEle.setAttribute("class","media-cont");
                mediaEle.setAttribute("id",imageObj.id);
                let url=imageObj.url;

                mediaEle.innerHTML=`
                <div class="media">
                   <img src="${url}"/>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `;
                galleryCont.appendChild(mediaEle);

                let deleteBtn=mediaEle.querySelector(".delete");
                deleteBtn.addEventListener("click",deleteListener);
                let downloadBtn=mediaEle.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);
                

            })
        }
    }

},100)
//ui remove,db remove
function deleteListener(e){
    //db removal
    
    let id=e.target.parentElement.getAttribute("id");
    let type=id.slice(0,3);
    if(type === "vid"){
        let dbTransaction=db.transaction("video","readwrite");
        let videoStore=dbTransaction.objectStore("video");
        videoStore.delete(id);

    }else if(type === "img"){
        let imagedbTransaction=db.transaction("image","readwrite");
        let imageStore=imagedbTransaction.objectStore("image");
        imageStore.delete(id);

    }
    //ui removal
    e.target.parentElement.remove();

}
function downloadListener(e){
    let id=e.target.parentElement.getAttribute("id");
    let type=id.slice(0,3);
    if(type==="vid"){
        let dbTransaction=db.transaction("video","readwrite");
        let videoStore=dbTransaction.objectStore("video");
        let videoRequest=videoStore.get(id);
        videoRequest.onsuccess=(e)=>{
            let videoResult=videoRequest.result;
            let videoURL=URL.createObjectURL(videoResult.blobData);
            let a=document.createElement("a");
            a.href=videoURL;
            a.download="stream.mp4";
            a.click();
        }

    }else if(type==="img"){
        let imagedbTransaction=db.transaction("image","readwrite");
        let imageStore=imagedbTransaction.objectStore("image");
        let imageRequest=imageStore.get(id);
        imageRequest.onsuccess=(e)=>{
            let imageResult=imageRequest.result;
            
            let a=document.createElement("a");
            a.href=imageResult.url;
            a.download="image.jpg";
            a.click();
        }

    }
    
}
