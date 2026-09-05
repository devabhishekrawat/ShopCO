import userModel from "./user.schema.js";

export const createNewUserRepo = async (user) => {
    return await new userModel(user).save();
};

export const findUserRepo = async (factor, withPassword = false) => {
    if (withPassword) return await userModel.findOne(factor).select("+password");
    else return await userModel.findOne(factor);
};

export const updateUserProfileRepo = async (_id, data) => {
    return await userModel.findOneAndUpdate(
        { _id },
        { $set: data },
        {
            new: true,
            runValidators: true
        }
    );
};

export const getAllUsersRepo = async () => {
    return await userModel.find({});
};

export const deleteUserRepo = async (_id) => {
    return await userModel.findByIdAndDelete(_id);
};
