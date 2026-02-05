import Profile from "../models/profile.js";
import fs from "fs";
import path from "path";

export async function getProfile(req, res) {
  try {
    const data = await Profile.findOne();

    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

export const createNewProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne();
    if (existing) {
      return res.status(409).json({
        message: "Profile already exists",
      });
    }

    const filePath = path.resolve("src/data/profile.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const profileData = JSON.parse(rawData);

    const profile = await Profile.create(profileData);

    res.status(201).json({
      message: "Profile seeded successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error seeding profile",
      error: error.message,
    });
  }
};

export const getProjectsByskills = async (req, res) => {
  try {
    let { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ message: "Skill query is required" });
    }

    // convert the query to lowercase for case-insensitive matching
    skill = skill.toLowerCase();

    const projectsData = await Profile.aggregate([
      { $unwind: "$projects" },
      {
        $match: {
          "projects.skills": {
            $regex: skill, // skill = req.query.skill.toLowerCase()
            $options: "i", // case-insensitive
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: "$projects.title",
          description: "$projects.description",
          skills: "$projects.skills",
          links: "$projects.links",
        },
      },
    ]);

    res.json({
      message: `Projects filtered by skill: ${skill}`,
      count: projectsData.length,
      data: projectsData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving projects",
      error: error.message,
    });
  }
};

export async function getTopSkills(req, res) {
  try {
    const topSkills = await Profile.aggregate([
      // 1️⃣ Combine profile skills with project skills
      {
        $project: {
          allSkills: {
            $concatArrays: [
              "$skills",
              {
                $reduce: {
                  input: "$projects",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this.skills"] },
                },
              },
            ],
          },
        },
      },
      // 2️⃣ Flatten the array
      { $unwind: "$allSkills" },
      // 3️⃣ Convert to lowercase for consistent counting
      { $set: { skill: { $toLower: "$allSkills" } } },
      // 4️⃣ Group by skill and count
      {
        $group: {
          _id: "$skill",
          count: { $sum: 1 },
        },
      },
      // 5️⃣ Sort by count descending
      { $sort: { count: -1 } },
      // 6️⃣ Project final output
      {
        $project: {
          _id: 0,
          skill: "$_id",
          count: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Top skills retrieved successfully",
      data: topSkills,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

export async function searchProfile(req, res) {
  try {
    let { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });
    }

    // Case-insensitive regex for partial matching
    const regex = new RegExp(q, "i");

    const results = await Profile.aggregate([
      // Unwind projects
      { $unwind: { path: "$projects", preserveNullAndEmptyArrays: true } },

      // Match any field
      {
        $match: {
          $or: [
            { name: regex },
            { skills: regex },
            { "projects.title": regex },
            { "projects.description": regex },
          ],
        },
      },

      // Group by profile to avoid duplicates if multiple projects match
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          education: { $first: "$education" },
          skills: { $first: "$skills" },
          links: { $first: "$links" },
          projects: { $push: "$projects" },
        },
      },
    ]);

    return res.status(200).json({
      message: `Search results for '${q}'`,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error searching profile",
      error: error.message,
    });
  }
}
