// this is from Simon's project 1
const tweetText = "Check this out! #coding";

const tweetUrl = encodeURIComponent("https://example.com/");

const tweetLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
console.log(tweetLink);

// this is for clicking social handles to populate login and post material

const generateBtn = document.querySelector("#twitter");
// const generateBtns = document.querySelector("#inputButton");

function showTwitter () {
    document.getElementById('twitterPop').innerHTML = '<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
}
// function showPost () {
//     document.getElementById('twitterPop').innerHTML = "I am Twitter";
// }

generateBtn.addEventListener("click", showTwitter);
// generateBtns.addEventListener("click", showPost);