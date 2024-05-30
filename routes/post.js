import express from "express";
import {posts} from "../index.js";

const router = express.Router();

//opens the post creation page
router.get("/", (req, res) => {
    res.render("post.ejs")
})

//posts the submitted form
router.post("/", (req,res) => {
    //collects the data submitted by the user
    const {title, genre, description, review} = req.body;
    const createdAt = new Date().toLocaleDateString();
    //function for making a url friendly title
    const urlFriendlyTitle = createUrlFriendlyTitle(title);
    //puts the collected data into a new object
    const newPost = {title, genre, createdAt, description, review, urlFriendlyTitle}
    //ads the new object to the beginning of the post array
    posts.unshift(newPost);
    //redirects the user to the individual post page
    res.redirect(`/${urlFriendlyTitle}`);
})

//opens a post editor
router.get("/:urlFriendlyTitle/edit", (req, res) => {
    //finds post that matches the url
    const post = posts.find(p => p.urlFriendlyTitle === req.params.urlFriendlyTitle);
    if (post) {
        //opens if exist
        res.render("edit-post.ejs", { post} );
    } else {
        //error if doesn't exist
        res.status(404).send("Post not found");
    }
})

//replace the old post with an updated one
router.put("/:urlFriendlyTitle", (req, res) => {
    //gets the value
    const { urlFriendlyTitle } = req.params;
    //finds the index of the object with this value
    const postIndex = posts.findIndex(p => p.urlFriendlyTitle === urlFriendlyTitle);
    if (postIndex !== -1) {
        //if it exists, it requests the data
        const { title, genre, description, review } = req.body;
        //makes a new const with the updated data
        const updatePost = { ...posts[postIndex], title, genre, description, review, urlFriendlyTitle: createUrlFriendlyTitle(title) };
        //replaces the old post
        posts[postIndex] = updatePost;
        //redirects to the individual post's page
        res.redirect(`/${updatePost.urlFriendlyTitle}`);
    } else {
        res.status(404).send("Post not found");
    }
})

//for deleting a post
router.delete("/:urlFriendlyTitle", (req, res) => {
    const { urlFriendlyTitle } = req.params;
    //get the object
    const postIndex = posts.findIndex(p => p.urlFriendlyTitle === urlFriendlyTitle)
    if (postIndex !== -1) {
        //removes the object from the array
        posts.splice(postIndex, 1); //one is for the amount of objects to be deleted
        res.sendStatus(200);
    } else {
        res.sendStatus(404).send("Post not found");
    }
})

//changes the post's title into a url friendly version
function createUrlFriendlyTitle(title) {
    //replaces white spaces with dashes and transform everything into lower case characters
    return title.toLowerCase().replace(/\s+/g, '-')
}

export default router;