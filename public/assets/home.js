
document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch all posts from the backend and update the UI
    function fetchAllPosts() {
        fetch("/api/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // Clear previous posts from the UI
                const timeslotContainer = document.querySelector("#timeslots .column2 .columns");
                timeslotContainer.innerHTML = "";

                if (data.length === 0) {
                    timeslotContainer.innerHTML = "<p class='bd-notification'>No posts available.</p>";
                } else {
                    data.forEach((post) => {
                        const postElement = document.createElement("p");
                        postElement.classList.add("bd-notification");
                        postElement.textContent = post.title; // Assuming the title is used as the post text

                        // You can format the date before displaying if required
                        const dateElement = document.createElement("p");
                        dateElement.textContent = "Date: " + post.date_created;

                        const platformElement = document.createElement("p");
                        platformElement.textContent = "User ID: " + post.user_id;

                        timeslotContainer.appendChild(postElement);
                        timeslotContainer.appendChild(dateElement);
                        timeslotContainer.appendChild(platformElement);
                    });
                }
            })
            .catch((error) => console.error("Error fetching posts:", error));
    }

    // Call fetchAllPosts on page load to display the posts
    fetchAllPosts();

    // Function to create a new post via AJAX
    // Function to create a new post
    function createNewPost() {
        const description = document.querySelector("#search-form .textarea").value;
        const platform = document.querySelector("#input-type").value;
        const date = document.querySelector("#select-end").value;

        // Create a new post in the backend
        fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
                platform: platform,
                date: date,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Fetch all posts again after creating a new post
                fetchAllPosts();
            })
            .catch((error) => console.error("Error creating post:", error));
    }

    // Handle form submission when "Post" button is clicked
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        createNewPost();
        searchForm.reset();
    });


    // Function to toggle button styles
    function toggleButtonsStyles(activeButton, inactiveButton) {
        activeButton.classList.add("active-button");
        activeButton.classList.remove("inactive-button");
        activeButton.classList.add("column1");

        inactiveButton.classList.add("inactive-button");
        inactiveButton.classList.remove("active-button");

    }

    // Handle "Future Posts" button click
    const futurePostsButton = document.querySelector(".is-danger");
    const previousPostsButton = document.querySelector(".column1 .bd-notification");

    futurePostsButton.addEventListener("click", function () {
        fetchAllPosts();
        toggleButtonsStyles(futurePostsButton, previousPostsButton);
    });

    // Handle "Previous Posts" button click
    previousPostsButton.addEventListener("click", function () {
        fetchAllPosts();
        toggleButtonsStyles(previousPostsButton, futurePostsButton);
    });
});



