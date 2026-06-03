const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const progressController = require('../controllers/progressController');
const pdfController = require('../controllers/pdfController');

// Homepage Dashboard
router.get('/', courseController.getDashboard);

// Course Page
router.get('/courses/:id', courseController.getCourse);

// Topic-Wise Revision Page
router.get('/courses/:id/topics', courseController.getTopics);

// Questions & Answers Study Page
router.get('/courses/:id/qa', courseController.getQA);

// Notes Page
router.get('/courses/:id/notes', courseController.getNotes);

// Search Page
router.get('/search', courseController.getSearch);

// API for live dynamic search suggestions
router.get('/api/search', courseController.apiSearch);

// Progress tracker updates (solved/unsolved)
router.patch('/progress/:questionId', progressController.updateProgress);

// PDF Viewer & Downloader
router.get('/courses/:id/pdf/:sectionId/:action', pdfController.handlePdfRequest);

module.exports = router;
