import {Router} from "express";
import {
  changeDetails,
  changePassword,
  createdUser,
  currentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";

const routs = Router();
routs.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createdUser
);
routs.route("/login").post(loginUser);

// secured routs
routs.route("/logout").post(verifyJwt, logoutUser);
routs.route("/refresh-token").post(refreshAccessToken);
routs.route("/change-password").post(verifyJwt, changePassword);
routs.route("/current-user").get(verifyJwt, currentUser);
routs.route("/change-details").patch(verifyJwt, changeDetails);
// routs.route("/change-avatar").patch(
//   verifyJwt,
//   upload.fields([{
//     name: "avatar",
//     maxCount: 1,
//   }]), updateAvatar
// );
routs.route("/change-avatar").patch(verifyJwt,upload.single("avatar"),updateAvatar)
// routs.route("/change-coverImage").patch(verifyJwt,upload.single("coverImage"),updateAvatar)
routs.route("/change-coverImage").patch(
  verifyJwt,
  upload.fields([{
    name: "coverImage",
    maxCount: 1,
  }]), updateCoverImage
);
routs.route("/c/:username").get(verifyJwt,getUserChannelProfile)
routs.route("/history").get(verifyJwt, getWatchHistory)

export default routs;
