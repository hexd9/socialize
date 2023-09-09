const { User, Thought } = require("../models");
const thoughtController = {
  async getAllThoughts(req, res) {
    try {
      const thoughtData = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async getThoughtById(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.id })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: "No thoughts found with that id!" });
      }
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const thoughtData = await Thought.create(req.body);
      const userId = req.body.userId;
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: "No thoughts found with that id!" });
      }
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndDelete({
        _id: req.params.id,
      });
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: "No thoughts found with that id!" });
      }
      const userId = thoughtData.userId;
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No User found with this id!" });
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionData = req.body;
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: reactionData } },
        { new: true, runValidators: true }
      )
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v");
      if (!thoughtData) {
        return res.status(404).json({ message: "No thoughts with this ID." });
      }
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { reactionId } } },
        { new: true }
      );
      if (!thoughtData) {
        return res.status(404).json({ message: "Nope!" });
      }
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.json(err);
    }
  },
};

module.exports = thoughtController;
