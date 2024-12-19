
const router = require("express").Router();
const Item = require("../models/item");
const multer = require('multer');

// Memory storage for images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to add a new item
router.route("/add").post(upload.array('images', 10), async (req, res) => {
    try {
        const { name, startingPrice, description, category, brand, features, material, condition,registeredSeller } = req.body;

        console.log("seller id is : ",registeredSeller)
        const images = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));

        const newItem = new Item({
            name,
            startingPrice,
            description,
            images,
            category,
            brand,
            features,
            material,
            condition,
            registeredSeller 

        });

        const savedItem = await newItem.save();

        res.status(201).json({
            message: "Item added successfully",
            itemId: savedItem._id
        });

    } catch (err) {
        res.status(500).json({
            message: "Error adding item",
            error: err.message
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const { search, category, brand, minPrice, maxPrice } = req.query;
        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" }; // case-insensitive search
        }
        if (category) {
            filter.category = category;
        }
        if (brand) {
            filter.brand = brand;
        }
        if (minPrice || maxPrice) {
            filter.startingPrice = {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) })
            };
        }

        const items = await Item.find(filter).populate('registeredSeller'); // Populate seller data

        const itemsWithBase64Images = items.map(item => ({
            ...item._doc,
            images: item.images.map(image => ({
                data: `data:${image.contentType};base64,${image.data.toString('base64')}`
            })),
            seller: item.registeredSeller // Add seller info to the response
        }));

        res.json(itemsWithBase64Images);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Route to get item details by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Extract ID from the request parameters
    try {
        // Find item by ID in the database
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Prepare item data with base64 images
        const itemWithBase64Images = {
            ...item._doc,
            images: item.images.map(image => ({
                data: `data:${image.contentType};base64,${image.data.toString('base64')}`
            }))
        };
        
        // Send the item details as a JSON response
        res.json(itemWithBase64Images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching item details", error: error.message });
    }
});

// Route to delete an item by name
router.delete('/delete/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const deletedItem = await Item.findOneAndDelete({ name });

        if (!deletedItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json({
            message: "Item deleted successfully",
            itemName: name
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting item",
            error: err.message
        });
    }
});

// Route to delete an auction
router.route("/delete/:id").delete(async (req, res) => {
    const { id } = req.params;
    console.log("id is:",id);

    try {
        const detedItem = await Item.findByIdAndDelete(id);

        if (!detedItem) {
            return res.status(404).json({ message: "item not found" });
        }

        res.status(200).json({
            message: "Item deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting item",
            error: err.message
        });
    }
});


// Route to get most available item category
router.get('/analytics/most-available-category', async (req, res) => {
    try {
        const categories = await Item.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        if (categories.length > 0) {
            res.json(categories[0]); // Send the most available category
        } else {
            res.status(404).json({ message: "No items found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching category data", error: err.message });
    }
});
// Route to get all item categories and their counts
router.get('/analytics/categories', async (req, res) => {
    try {
        const categories = await Item.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Error fetching category data", error: err.message });
    }
});



module.exports = router;
