const router = require("express").Router();
const Payment = require("../models/payment");

// Route to add a new payment
router.post("/add", async (req, res) => {
    try {
        const { cardType, cardNumber, expirationMonth, expirationYear, cvv, fullName, email, address, city, state, zipCode } = req.body;

        const newPayment = new Payment({
            cardType,
            cardNumber,
            expirationMonth,
            expirationYear,
            cvv,
            fullName,
            email,
            address,
            city,
            state,
            zipCode
        });

        const savedPayment = await newPayment.save();

        res.status(201).json({
            message: "Payment added successfully",
            paymentId: savedPayment._id
        });
    } catch (err) {
        res.status(500).json({
            message: "Error adding payment",
            error: err.message
        });
    }
});

// Route to get all payments
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
});

// Route to get a payment by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const payment = await Payment.findById(id);
        
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: "Error fetching payment", error: err.message });
    }
});

// Route to update a payment by ID
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { cardType, cardNumber, expirationMonth, expirationYear, cvv, fullName, email, address, city, state, zipCode } = req.body;
    
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            id, 
            {
                cardType,
                cardNumber,
                expirationMonth,
                expirationYear,
                cvv,
                fullName,
                email,
                address,
                city,
                state,
                zipCode
            },
            { new: true } // Return the updated document
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json({ message: "Payment updated successfully", payment: updatedPayment });
    } catch (err) {
        res.status(500).json({ message: "Error updating payment", error: err.message });
    }
});

// Route to delete a payment by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting payment", error: err.message });
    }
});

// Route to get payment statistics (e.g., count of payments)
router.get('/analytics', async (req, res) => {
    try {
        const count = await Payment.countDocuments();
        res.json({ totalPayments: count });
    } catch (err) {
        res.status(500).json({ message: "Error fetching payment statistics", error: err.message });
    }
});

module.exports = router;
