const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');


const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({
            where: { userId: userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ],
        });

        res.status(200).json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});

// GET all reviews for a specific spot
router.get('/spots/:id/reviews', async (req, res, next) => {
    const spotId = req.params.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const reviews = await Review.findAll({
            where: { spotId: spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                },
            ],
        });

        res.status(200).json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});

// authentication
router.post('/spots/:id/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = req.params.id;
    const userId = req.user.id;

    try {
        // Check if the spot exists
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the user already has a review for this spot
        const existingReview = await Review.findOne({ where: { userId, spotId } });
        if (existingReview) {
            return res.status(400).json({ message: "User already has a review for this spot" });
        }

        // Validate review and stars
        if (!review || !stars || stars < 1 || stars > 5) {
            return res.status(400).json({ message: "Bad Request", errors: { review: "Review text is required", stars: "Stars must be an integer from 1 to 5" } });
        }

        // Create the review
        const newReview = await Review.create({ userId, spotId, review, stars });
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// POST an image to a review
router.post('/reviews/:id/images', requireAuth, async (req, res, next) => {
    const reviewId = req.params.id;
    const { url } = req.body;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const imageCount = await ReviewImage.count({ where: { reviewId: reviewId } });
        if (imageCount >= 10) {
            return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
        }

        const newImage = await ReviewImage.create({ reviewId, url });
        res.status(200).json(newImage);
    } catch (error) {
        next(error);
    }
});

// PUT - Update a review
router.put('/reviews/:id', requireAuth, async (req, res, next) => {
    const reviewId = req.params.id;
    const { review, stars } = req.body;
    const userId = req.user.id;

    try {
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (existingReview.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!review || stars < 1 || stars > 5) {
            return res.status(400).json({ message: "Bad Request", errors: { review: "Review text is required", stars: "Stars must be an integer from 1 to 5" } });
        }

        existingReview.review = review;
        existingReview.stars = stars;
        await existingReview.save();

        res.status(200).json(existingReview);
    } catch (error) {
        next(error);
    }
});

//DELETE a review
router.delete('/reviews/:id', requireAuth, async (req, res, next) => {
    const reviewId = req.params.id;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await review.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

//DELETE review image
router.delete('/reviews/:reviewId/images/:imageId', requireAuth, async (req, res, next) => {
    const { reviewId, imageId } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const image = await ReviewImage.findByPk(imageId);
        if (!image || image.reviewId !== review.id) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        await image.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
