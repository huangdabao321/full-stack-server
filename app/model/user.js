// {app_root}/app/model/user.js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema(
    {
      email: { type: String, required: true },
      nickname: { type: String, required: true },
      avatar: { type: String, required: true, default: "user.png" },
      pwd: { type: String, required: true },
    },
    { timestamps: true }
  );

  return mongoose.model("User", UserSchema);
};
