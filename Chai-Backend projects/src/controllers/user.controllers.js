import {asyncHandler} from "../utils/asyncHandlers.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    // console.log(accessToken);
    const refreshToken = user.generateRefreshToken();
    // console.log(refreshToken);
    user.refreshToken = refreshToken;
    user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const option = {
  httpOnly: true,
  secure: true,
};

const createdUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  // validation - not empty
  // check if user already exist by username , email, and so on
  // check for image - check for avatar image
  // upload them to cloudinary - check avatar
  // create user object - create db entry
  // remove password and refreshToken from response
  // check for user creation
  // return response

  const {username, email, fullName, password} = req.body;
  // console.log ("username: ",username, "email: ", email, "password", password)

  if (username === "") {
    return new ApiError(400, "username is required");
  }
  if (
    [fullName, username, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existUser = await User.findOne({
    $or: [{username}, {email}],
  });
  if (existUser) {
    throw new ApiError(409, "user already exist with this username or email");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log("avatar local path" ,avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading the avatar");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User register successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body - data
  // check username or email - not empty
  // find the user
  // password check
  // create access and refresh Tokens
  // send response - cookies

  // console.log(req.body)
  const {username, email, password} = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{username}, {email}],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValidate = await user.isPasswordCorrect(password);
  if (!isPasswordValidate) {
    throw new ApiError(401, "Invalid user credential");
  }
  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // console.log(req.cookies)
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // console.log(decodedRefreshToken._id);

    const user = await User.findById(decodedRefreshToken._id);
    // console.log(user)
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    // console.log(incomingRefreshToken, "hii", user.refreshToken);
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expire or used");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
      user._id
    );
    // console.log("new: =" ,refreshToken)

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(
          200,
          {accessToken, refreshToken: refreshToken},
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  // console.log(req.user, "oldPassword",oldPassword,"newPassword",newPassword)
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }
  user.password = newPassword;
  await user.save({validateBeforeSave: false});
  // console.log("password changed")
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Update Successfully!"));
});

const currentUser = asyncHandler(async (req, res) => {
  // console.log(req.user)
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const changeDetails = asyncHandler(async (req, res) => {
  // console.log(req.user, req.body)
  const {fullName, email} = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "required all fields");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    {new: true}
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const avatar = await uploadCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(
      500,
      "Error has occurred while uploading avatar on cloudinary "
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {avatar: avatar.url},
    },
    {new: true}
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar has successfully changed"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage[0].path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage file is missing");
  }
  const coverImage = await uploadCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiError(
      500,
      "Error has occurred while uploading coverImage on cloudinary "
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {coverImage: coverImage.url},
    },
    {new: true}
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage has successfully changed"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params;
  if (!username?.trim) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "chanel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        subscribedChannelCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {$in: [req.user?._id, "$subscribers.subscriber"]},
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        subscribedChannelCount: 1,
        subscriberCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exists");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watchHistory fetched successfully"
      )
    );
});
export {
  createdUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  currentUser,
  changeDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
