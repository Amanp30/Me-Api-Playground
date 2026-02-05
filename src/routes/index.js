import { Router } from "express";
import {
  createNewProfile,
  getProfile,
  getProjectsByskills,
  getTopSkills,
  searchProfile,
} from "../controllers/profile.js";

const router = Router();

/**
 * GET /api/profile
 * Get profile data
 */
router.get("/profile", getProfile);

/**
 * POST /api/profile
 * One-time profile seed
 */
router.post("/profile", createNewProfile);

/**
 * GET /api/projects
 * Get projects by query skills
 */
router.get("/projects", getProjectsByskills);

/**
 * GET /api/skills/top
 * Get top skills across all profiles
 */
router.get("/skills/top", getTopSkills);

/**
 * GET /api/search
 * Search profiles by q
 */
router.get("/search", searchProfile);

export default router;
