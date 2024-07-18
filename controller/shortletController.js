const express = require('express');
const { processPaymentWithFlutterwave } = require('../services/paymentService.js'); 

const getShortlets = async (req, res) => {
    const { page = 1, state } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    const where = state ? { state } : {};
    const shortlets = await Shortlet.findAll({ where, limit, offset });
    res.json(shortlets);
};

const createShortlet = async (req, res) => {
    const { apartmentName, state, numberOfRooms, address, amountPerNight, numberOfNights } = req.body;
    const imageUrls = req.files.map(file => file.path);
    const shortlet = await Shortlet.create({ apartmentName, state, numberOfRooms, address, amountPerNight, numberOfNights, imageUrls });
    res.status(201).json(shortlet);
};

const bookShortlet = async (req, res) => {
    const { id } = req.params;
    const { numberOfNights } = req.body;
    const shortlet = await Shortlet.findByPk(id);
    if (!shortlet) {
        return res.sendStatus(404);
    }
    const amount = shortlet.amountPerNight * numberOfNights;
    // Process payment with Fincra (pseudo code)
    const paymentResponse = await processPaymentWithFlutterwave(req.user.id, amount);
    if (paymentResponse.status === 'success') {
        res.json({ status: 200, apartmentName: shortlet.apartmentName });
    } else {
        res.sendStatus(500);
    }
};

const countShortlets = async (req, res) => {
    const count = await Shortlet.count();
    res.json({ count });
};

module.exports = { getShortlets, createShortlet, bookShortlet, countShortlets };
