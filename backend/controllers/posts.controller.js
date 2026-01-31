import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profilee.js";
import Post from '../models/posts.model.js';
import Comment from '../models/comments.model.js'

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const post = new Post({
     userId : user._id,
     body : req.body.body,
     media: req.file != undefined ? req.file.filename : "",
     fileType : req.file != undefined ? req.file.mimetype.split("/") : ""
    })
    await post.save();
    return res.status(200).json({message:"Post Created"});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req,res) =>{
    try{
    const posts = await Post.find().populate('userId' , 'name username email profilePicture');
    return res.json(posts);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
   
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not exist" });
    }

    
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   
    if (!post.userId || !post.userId.equals(user._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;

  try {
  
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await newComment.save();

    return res.status(200).json({ message: "Comment added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const get_comments_by_post = async(req,res) =>{
  const {post_id} = req.query;
  try{
   const post = await Post.findOne({_id:post_id});
  if(!post){
    res.status(404).json({message:"Post not found"});
  }

  const comments = await Comment.find({postId:post_id}).populate('userId' ,'username name')
  
  return res.json(comments.reverse());
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}

export const delete_comment_of_user = async (req,res)=>{
  const {token , comment_id} = req.body;

  try{
   const user = User.findOne({token}).select("_id");
  if(!user){
    return res.status(404).json("User not found");
  }
  const comment = Comment.findOne({"_id":comment_id});
  if(!comment){
    res.status(404).json({message:"Post not found"});
  }
  if(comment.userId.toString()!=user._id.toString()){
    return res.status(401).json({message:"Unauthorized"});
  }
  await Comment.deleteOne({"_id":comment_id});
  return res.json("Comment Deleted");
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}


export const increment_likes = async (req, res) => {
  const { post_id } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      post_id,
      { $inc: { likes: 1 } },
      { new: true } 
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Likes incremented",
      likes: post.likes
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
