import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  skills: { type: [String], required: true },
  links: { type: [String], required: true }, // multiple links
});

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    education: { type: String, trim: true, required: true },
    skills: { type: [String], required: true, default: [] },
    projects: { type: [projectSchema], default: [] },
    links: {
      github: { type: String, required: true },
      linkedin: { type: String, required: true },
      portfolio: { type: String, required: true },
    },
  },
  { timestamps: true },
);

ProfileSchema.index({
  skills: "text",
  "projects.title": "text",
  "projects.description": "text",
  name: "text",
});

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
