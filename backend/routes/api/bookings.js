const express = require('express');
const { Booking, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//GET all current user's booking
router.get('/bookings/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    try {
        const bookings = await Booking.findAll({
            where: { userId: userId },
            include: [{
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
            }]
        });

        res.status(200).json({ Bookings: bookings });
    } catch (error) {
        next(error);
    }
});

//GET all booking by spot id
router.get('/spots/:id/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.id;
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        let queryOptions = { where: { spotId: spotId } };

        if (spot.ownerId !== userId) {
            queryOptions.attributes = ['spotId', 'startDate', 'endDate'];
        } else {
            queryOptions.include = [{ model: User, attributes: ['id', 'firstName', 'lastName'] }];
        }

        const bookings = await Booking.findAll(queryOptions);
        res.status(200).json({ Bookings: bookings });
    } catch (error) {
        next(error);
    }
});

//POST booking from spot id
router.post('/spots/:id/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.id;
    const { startDate, endDate } = req.body;
    const userId = req.user.id; // Assuming req.user is set after authentication

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId === userId) {
            return res.status(403).json({ message: "Cannot book your own spot" });
        }

        //booking conflicts

        const newBooking = await Booking.create({ spotId, userId, startDate, endDate });
        res.status(200).json(newBooking);
    } catch (error) {
        next(error);
    }
});

//PUT edit booking
router.put('/bookings/:id', requireAuth, async (req, res, next) => {
    const bookingId = req.params.id;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // booking conflicts

        booking.startDate = startDate;
        booking.endDate = endDate;
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
});

//DELETE - a booking
router.delete('/bookings/:id', requireAuth, async (req, res, next) => {
    const bookingId = req.params.id;
    const userId = req.user.id; // Assuming req.user is set after authentication

    try {
        const booking = await Booking.findByPk(bookingId, {
            include: { model: Spot }
        });
        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Check if the booking has already started
        const currentDate = new Date();
        if (new Date(booking.startDate) <= currentDate) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }

        await booking.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
