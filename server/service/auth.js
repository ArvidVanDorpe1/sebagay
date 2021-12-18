import User from "../models/user.js";
import bcrypt from "bcrypt";

const authService = {
  register: async (req, res) => {
    try {
      //salting en hashing wachtwoord voor veiligere storage
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user en respond
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(404).json("user niet gevonden");

      const geldigPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !geldigPassword && res.status(400).json("Verkeerd Wactwoord");

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default authService;
