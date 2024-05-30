import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import postRouter from "./routes/post.js";
import predefinedPosts from "./predefindedPosts.json" assert { type: "json"};

const app = express();
const port = 3000;

console.log("Predefined posts:", predefinedPosts);

//initialise posts with predefined posts
let posts = predefinedPosts.map(post => ({
    ...post,
    createdAt: new Date().toLocaleDateString()
}));

console.log("Initialized posts:", posts);

//middleware allowing for posts to be identified in other routers
app.use((req, res, next) => {
    req.posts = posts;
    next();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

//connects to the post router
app.use('/post', postRouter); 

//opens the homepage
app.get("/", (req, res) => {
    res.render("index.ejs", {posts : posts});
});

//opens an individual post page
app.get("/:urlFriendlyTitle", (req, res) => {
    //finds a post with specific url
    const post = posts.find(p => p.urlFriendlyTitle === req.params.urlFriendlyTitle);
    if(post) {
        //opens the page if exists
        res.render("singlePost.ejs", {post : post});
    } else {
        //returns the 404 status
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
});

//allows other modules to import it if needed
export {posts};