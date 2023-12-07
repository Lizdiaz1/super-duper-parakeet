// backend/routes/api/spots.js
const express = require('express');
const { Spot, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


const router = express.Router();

// Get all spots
router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'previewImage', 'avgRating'],

        });

        res.json({ spots });
    } catch (error) {
        next(error);
    }
});

//get details of a spot from an id
router.get('/:id', async (req, res, next) => {
    const spotId = req.params.id;
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.json(spot);
});

//create a spot
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

    try {
        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        res.status(201).json(newSpot);
    } catch (error) {
        // Handles validation errors
        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: "Bad Request",
                errors: error.errors.map(e => e.message)
            });
        }
        next(error);
    }
});
// adding an image to a spot
router.post('/:id/images', requireAuth, async (req, res, next) => {
    const { id } = req.params; // Spot ID
    const { url, preview } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(id);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden: You don't own this spot" });
    }

    const newImage = await SpotImage.create({
        spotId: id,
        url,
        preview
    });

    return res.status(201).json(newImage);
});

//edit spot
router.put('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(id);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden: You don't own this spot" });
    }

    spot.update({
        address, city, state, country, lat, lng, name, description, price
    });

    return res.json(spot);
});
//delete a spot
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(id);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden: You don't own this spot" });
    }

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
});

//DELETE - a spot image
router.delete('/spots/:spotId/images/:imageId', requireAuth, async (req, res, next) => {
    const { spotId, imageId } = req.params;
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const image = await SpotImage.findByPk(imageId);
        if (!image || image.spotId !== spot.id) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }

        await image.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
