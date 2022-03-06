/**
 * Sends request to server to update the likes on a post. 
 * If the server update is successful the interface is updated as well.
 */
(function like(){
    let button = document.getElementById("likeButton");
    if(button){
        button.addEventListener('click', function() {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", window.location.href+"/like", true);
            xhr.onreadystatechange = function () {
                if ((this.readyState === 4) && (this.status === 200)) {
                    let likeIcon=document.getElementsByClassName("fa fa-heart")[0];
                    let postLikes = document.getElementById('like-count');
                    if(likeIcon.style.color==="gray"){
                        let value = parseInt(postLikes.textContent) + 1;
                        postLikes.textContent = value + " likes";
                        likeIcon.style.color = "red";
                    }
                    else{
                        let value = parseInt(postLikes.textContent) - 1;
                        postLikes.textContent = value + " likes";
                        likeIcon.style.color = "gray";
                    }
                }
            };
            xhr.send();
        })    
    }   
})();

/**
 * Sends request to server to post a comment.
 * If successful the page is reloaded, if response status is unauthorized the user is redirected to login.
 */
(function postComment(){
    let button = document.getElementById("postCommentButton");
    button.addEventListener('click', function() {
        let textArea = document.getElementById("commentTextArea");
        if(textArea.value){
            let xhr = new XMLHttpRequest();
            xhr.open("POST", window.location.href+"/postComment", true);
            var data = new FormData();
            data.append('newCommentContent', textArea.value);
            xhr.onreadystatechange = function () {
                if (this.readyState === 4){
                    if(this.status === 200){
                        location.reload();
                    }
                    else if(this.status===401){
                        location.href='/users/login';
                    }
                }                
            };
            xhr.send(data);
        }
    });
})();