import User from "../models/User.js";
import UserFollower from "../models/UserFollower.js";
import UserFollowing from "../models/UserFollowing.js";
import UserFriend from "../models/UserFriend.js";
import UserRequest from "../models/UserRequest.js";

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not exist" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProfile = async (req, res) => {
  try {
    const user = await User.findAll({});
    if (user.length < 1) {
      return res.status(404).json({ message: "No users founds" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not exist" });
    await User.update(req.body, { where: { id: id } });
    const profile = await User.findByPk(id);
    return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  const { id } = req.user;
  const { friend } = req.params;
  try {
    let x = false;
    if (id == friend) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }
    const sender = await User.findByPk(id);
    const receiver = await User.findByPk(friend);
    const check = await UserRequest.findAll();

    check.forEach((e) => {
      if (e.request_id == friend) {
        x = true;
      }
    });

    if (!x) {
      await UserRequest.create({
        user_id: sender.id,
        request_id: receiver.id,
      });
      await UserFollower.create({
        user_id: sender.id,
        follower_id: receiver.id,
      });

      await UserFollowing.create({
        user_id: receiver.id,
        following_id: sender.id,
      });
      return res.json({ message: "Friend request has been sent" });
    }

    const requset = await UserRequest.findOne({
      where: { request_id: friend },
    });
    const follower = await UserFollower.findOne({
      where: { follower_id: friend },
    });
    await UserRequest.destroy({ where: { id: requset.id } });
    await UserFollower.destroy({ where: { id: follower.id } });

    const receiverFollowing = await UserFollowing.findOne({
      where: { following_id: id },
    });
    await UserFollowing.destroy({ where: { id: receiverFollowing.id } });

    return res.json({ message: "friend request has been removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const followUnfollow = async (req, res) => {
  const { id } = req.user;
  const { follow } = req.params;
  try {
    let x = false;
    if (id == follow) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    const sender = await User.findByPk(id);
    const receiver = await User.findByPk(follow);
    const followers = await UserFollower.findAll();

    followers.forEach((e) => {
      if (e.follower_id == follow) {
        x = true;
      }
    });

    if (!x) {
      await UserFollower.create({
        user_id: sender.id,
        follower_id: receiver.id,
      });
      return res.json({ message: "Follow success" });
    }

    const follower = await UserFollower.findOne({
      where: { follower_id: follow },
    });
    await UserFollower.destroy({ where: { id: follower.id } });

    return res.json({ message: "unfollow success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const acceptRequest = async (req, res) => {
  const { id } = req.user;
  const { accept } = req.params;
  try {
    let x = false;
    if (id == accept) {
      return res.status(400).json({ message: "You can't add yourself" });
    }
    const sender = await User.findByPk(id);
    const receiver = await User.findByPk(accept);
    const requests = await UserRequest.findAll();

    requests.forEach((e) => {
      if (e.request_id == accept) {
        x = true;
      }
    });

    if (x) {
      await UserFriend.create({
        user_id: sender.id,
        friend_id: receiver.id,
      });
      await UserFriend.create({
        user_id: receiver.id,
        friend_id: sender.id,
      });
      const request = await UserRequest.findOne({
        where: { request_id: accept },
      });
      await UserRequest.destroy({ where: { id: request.id } });
      return res.json({ message: "Freind request accepted" });
    }

    return res.json({ message: "Already friends" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  const { id } = req.user;
  const { reject } = req.params;
  try {
    let x = false;
    if (id == reject) {
      return res.status(400).json({ message: "You can't reject yourself" });
    }
    const requests = await UserRequest.findAll();

    requests.forEach((e) => {
      if (e.request_id == reject) {
        x = true;
      }
    });

    if (x) {
      const request = await UserRequest.findOne({
        where: { request_id: reject },
      });
      await UserRequest.destroy({ where: { id: request.id } });
      return res.json({ message: "Friend request rejected" });
    }

    return res.json({ message: "Request not exist" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const unfriend = async (req, res) => {
  const { id } = req.user;
  const { friend } = req.params;
  try {
    let x = false;
    if (id == friend) {
      return res.status(400).json({ message: "You can't unfriend yourself" });
    }
    const freinds = await UserFriend.findAll();

    freinds.forEach((e) => {
      if (e.friend_id == friend) {
        x = true;
      }
    });

    if (x) {
      const senderFriend = await UserFriend.findOne({
        where: { friend_id: friend },
      });
      const senderFollower = await UserFollower.findOne({
        where: { follower_id: friend },
      });
      const senderFollowing = await UserFollowing.findOne({
        where: { following_id: friend },
      });
      await UserFriend.destroy({ where: { id: senderFriend.id } });
      if (senderFollower) {
        await UserFollower.destroy({ where: { id: senderFollower.id } });
      }
      if (senderFollowing) {
        await UserFollowing.destroy({ where: { id: senderFollowing.id } });
      }

      /////////////////////////////////////////////////
      const receiverFriend = await UserFriend.findOne({
        where: { friend_id: id },
      });
      const receiverFollower = await UserFollower.findOne({
        where: { follower_id: id },
      });
      const receiverFollowing = await UserFollowing.findOne({
        where: { following_id: id },
      });
      await UserFriend.destroy({ where: { id: receiverFriend.id } });
      if (receiverFollower) {
        await UserFollower.destroy({ where: { id: receiverFollower.id } });
      }
      if (receiverFollowing) {
        await UserFollowing.destroy({ where: { id: receiverFollowing.id } });
      }
    }

    return res.json({ message: "Unfriend success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
