// backend/routes/api/spots.js
const express = require('express');
const { Spot } = require('../../db/models'); // Adjust the path as per your models directory

const router = express.Router();

// Get all spots
router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'previewImage', 'avgRating'],
            // Include any additional queries, associations, or logic as required
        });

        res.json({ spots });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
