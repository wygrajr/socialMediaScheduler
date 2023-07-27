const { Project } = require('../models');
const express = require('express');
const router = express.Router();


module.exports = {
  getAllPosts: async (req, res) => {
    try {
      // Fetch all projects from the database associated with the logged-in user
      const projects = await Project.findAll({ where: { user_id: req.userId } });
      res.status(200).json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createPost: async (req, res) => {
    try {
      // Extract project data from the request body
      const { title, description, platform, date } = req.body;

      // Create a new project in the database
      const newProject = await Project.create({
        name: title, // You might want to change this property name if needed
        description,
        date_created: date,
        user_id: req.userId,
      });

      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


  updatePost: async (req, res) => {
    try {
      // Extract project data from the request body
      const { name, description, needed_funding } = req.body;

      // Find the project by its ID in the database
      const projectId = req.params.projectId;
      const project = await Project.findByPk(projectId);

      // Update the project with the new data
      if (project && project.user_id === req.userId) {
        project.name = name;
        project.description = description;
        project.needed_funding = needed_funding;
        await project.save();

        res.status(200).json(project);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find the project by its ID in the database
      const projectId = req.params.projectId;
      const project = await Project.findByPk(projectId);

      // Delete the project from the database
      if (project && project.user_id === req.userId) {
        await project.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

