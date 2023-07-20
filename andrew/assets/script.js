// this is from Simon's project 1
const tweetText = "Check this out! #coding";

const tweetUrl = encodeURIComponent("https://example.com/");

const tweetLink = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
console.log(tweetLink);

// this is for clicking social handles to populate login and post material

const generateBtn = document.querySelector("#twitter");

function showTwitter () {

}

generateBtn.addEventListener("click", showTwitter);