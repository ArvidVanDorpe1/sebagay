import User from "../repository/user.js";
import bcrypt from "bcrypt";

const userService = {
  getUserById: async (req, res) => {
    try {
      const user = User.findById(req.params.id);
      const { password, updatedAt, createdAt, isAdmin, ...other } = user._doc;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateUserById: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          return res.status(500).json(error);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account geupdated");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("Je kan enkel je eigen account aanpassen!");
    }
  },
  deleteUserById: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account is verwijderd");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("Je kan enkel je eigen account verwijderen!");
    }
  },
  volgUserById: async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const userNu = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await userNu.updateOne({ $push: { followings: req.body.userId } });
          res.status(200).json("Je volgt nu de user");
        } else {
          res.status(403).json("Je volgt deze persoon al");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("je kan jezelf niet volgen");
    }
  },
  ontvolgUserById: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const userNU = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await userNU.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("Je hebt de user ontvolgt");
        } else {
          res.status(403).json("Je volgt deze user niet");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Je kan jezelf niet ontvolgen");
    }
  },
  getAlleVrienden: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const vrienden = await Promise.all(
        user.followings.map((vriendId) => {
          return User.findById(vriendId);
        })
      );
      let vriendenlijst = [];
      vrienden.map((vriend) => {
        const { _id, username, profilePicture } = vriend;
        vriendenlijst.push({ _id, username, profilePicture });
      });
      res.status(200).json(vriendenlijst);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default userService;
