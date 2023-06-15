import User from "./models/User.js";
import Follower from "./models/Follower.js";
import Following from "./models/Following.js";
import Friends from "./models/Friends.js";
import Request from "./models/Request.js";
import SavedPost from "./models/SavedPost.js";
import UserFriend from "./models/UserFriend.js";
import UserRequest from "./models/UserRequest.js";
import UserFollower from "./models/UserFollower.js";
import UserFollowing from "./models/UserFollowing.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";

//User - Follower
User.hasMany(Follower, {
  foreignKey: { name: "user_id" },
});
Follower.belongsTo(User, {
  foreignKey: "user_id",
});

//User - Following
User.hasMany(Following, {
  foreignKey: { name: "user_id" },
});
Following.belongsTo(User, {
  foreignKey: "user_id",
});

//User - Friends
User.hasMany(Friends, {
  foreignKey: { name: "user_id" },
});
Friends.belongsTo(User, {
  foreignKey: "user_id",
});

//User - Request
User.hasMany(Request, {
  foreignKey: { name: "user_id" },
});
Request.belongsTo(User, {
  foreignKey: "user_id",
});

//User - SavedPost
User.hasMany(SavedPost, {
  foreignKey: { name: "user_id" },
});
SavedPost.belongsTo(User, {
  foreignKey: "user_id",
});

//UserFriend - User
UserFriend.hasMany(User, {
  foreignKey: { name: "user_id" },
});
User.belongsTo(UserFriend, {
  foreignKey: "user_id",
});

//UserRequest - User
UserRequest.hasMany(User, {
  foreignKey: { name: "user_id" },
});
User.belongsTo(UserRequest, {
  foreignKey: "user_id",
});

//UserFollower - User
UserFollower.hasMany(User, {
  foreignKey: { name: "user_id" },
});
User.belongsTo(UserFollower, {
  foreignKey: "user_id",
});

//UserFollowing - User
UserFollowing.hasMany(User, {
  foreignKey: { name: "user_id" },
});
User.belongsTo(UserFollowing, {
  foreignKey: "user_id",
});

//User - Post
User.hasMany(Post, {
  foreignKey: { name: "user_id" },
});
Post.belongsTo(User, {
  foreignKey: "user_id",
});

//Post - Comment
Post.hasMany(Comment, {
  foreignKey: { name: "post_id" },
});
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

//SavedPost - User
SavedPost.hasMany(User, {
  foreignKey: { name: "user_id" },
});
User.belongsTo(SavedPost, {
  foreignKey: "user_id",
});

//SavedPost - Post
SavedPost.hasMany(Post, {
  foreignKey: { name: "post_id" },
});
Post.belongsTo(SavedPost, {
  foreignKey: "post_id",
});
