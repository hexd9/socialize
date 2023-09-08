const { User, Thought } = require("../models");
const userController = {
  async getUsers(req, res) {
    try {
      const userData = await User.find().select("-__v");
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("friends")
        .populate("thoughts");
      if (!userData) {
        return res.status(404).json({ message: "no user data" });
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "no user data" });
      }
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: req.params.userId });
      if (!userData) {
        return res.status(404).json({ message: "no user data" });
      }
      await Thought.deleteMany({
        // come back to this
        _id: { $in: userData.thoughts },
      });
      res.json({ message: "thoughts were deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
        const userData = await User.findOneAndUpdate({_id: req.params.userId},{$addToSet: req.params.friendId}, {new: true})
        if(!userData){
            return res.status(404).json({message: 'friend not added'})
        }
        res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async removeFriend (req, res) {
    try {
        const userData = await User.findOneAndUpdate({_id: req.params.userId},{$pull: {Friends: req.params.friendId}}, {new: true})
        if(!userData){
            return res.status(404).json({message: 'friend not deleted'})
        }
        res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};

module.exports = userController;
