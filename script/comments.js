function initComments() {
    const comments = document.querySelectorAll('.comment');
    comments.forEach(comment => {
        const commentId = comment.getAttribute('data-comment-id');
        const likeButton = comment.querySelector('.action-like');
        const likeCountElement = comment.querySelector('.like-count');
        let likeCount = parseInt(likeCountElement.textContent);
        const dislikeButton = comment.querySelector('.action-dislike');
        const dislikeCountElement = dislikeButton.querySelector('.dislike-count');
        let dislikeCount = parseInt(dislikeCountElement.textContent);

        let hasLiked = localStorage.getItem(`liked_${commentId}`) === 'true';
        if (hasLiked) likeButton.classList.add('liked');
        let hasDisliked = localStorage.getItem(`disliked_${commentId}`) === 'true';
        if (hasDisliked) dislikeButton.classList.add('disliked');

        likeButton.addEventListener('click', () => {
            if (hasLiked) {
                likeCount -= 1;
                likeCountElement.textContent = likeCount;
                localStorage.setItem(`liked_${commentId}`, 'false');
                likeButton.classList.remove('liked');
                hasLiked = false;
            } else {
                likeCount += 1;
                likeCountElement.textContent = likeCount;
                localStorage.setItem(`liked_${commentId}`, 'true');
                likeButton.classList.add('liked');
                hasLiked = true;
                if (hasDisliked) {
                    dislikeCount -= 1;
                    dislikeCountElement.textContent = dislikeCount;
                    localStorage.setItem(`disliked_${commentId}`, 'false');
                    dislikeButton.classList.remove('disliked');
                    hasDisliked = false;
                }
            }
        });

        dislikeButton.addEventListener('click', () => {
            if (hasDisliked) {
                dislikeCount -= 1;
                dislikeCountElement.textContent = dislikeCount;
                localStorage.setItem(`disliked_${commentId}`, 'false');
                dislikeButton.classList.remove('disliked');
                hasDisliked = false;
            } else {
                dislikeCount += 1;
                dislikeCountElement.textContent = dislikeCount;
                localStorage.setItem(`disliked_${commentId}`, 'true');
                dislikeButton.classList.add('disliked');
                hasDisliked = true;
                if (hasLiked) {
                    likeCount -= 1;
                    likeCountElement.textContent = likeCount;
                    localStorage.setItem(`liked_${commentId}`, 'false');
                    likeButton.classList.remove('liked');
                    hasLiked = false;
                }
            }
        });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initComments };
} else {
    initComments();
}