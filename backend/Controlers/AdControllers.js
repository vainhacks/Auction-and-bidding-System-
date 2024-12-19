const Ad = require("../models/AdModel");

const fetch = require('node-fetch'); 


const FACEBOOK_PAGE_ACCESS_TOKEN = '1617234565489521|nmCkBilKy82u3HagP3HqDpJ262Y';
const getAllAds = async (req, res) => {
    let ads;
    try {
        ads = await Ad.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while fetching ads" });
    }

    if (!ads || ads.length === 0) {
        return res.status(404).json({ message: "Ads not found" });
    }

    return res.status(200).json({ ads });
};

const shareOnFacebook = async (title, description, image) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v20.0/me/feed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `${title} - ${description}`,
                link: image,
                access_token: FACEBOOK_PAGE_ACCESS_TOKEN
            })
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
        }
    } catch (error) {
        console.error('Error sharing on Facebook:', error);
    }
};


const addAds = async (req, res, next) => {
    const { image, date, title, description } = req.body;

    let ad;
    try {
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        ad = new Ad({ image, date: formattedDate, title, description });
        await ad.save();

        // After saving the ad, share it on Facebook
        const shared = await shareOnFacebook(title, description, image);
        if (!shared) {
            return res.status(500).json({ message: "Ad created but failed to share on Facebook" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while adding ad" });
    }

    if (!ad) {
        return res.status(404).json({ message: "Unable to add ad" });
    }

    return res.status(200).json({ ad, message: "Ad created and shared on Facebook successfully" });
};
const getById = async (req, res, next) => {
    const id = req.params.id;

    let ad;

    try {
        ad = await Ad.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while fetching the ad" });
    }

    if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
    }
    return res.status(200).json({ ad });
};

const updateAd = async (req, res, next) => {
    const id = req.params.id;
    const { image, date, title, description } = req.body;

    let ad;

    try {
        ad = await Ad.findByIdAndUpdate(id, { image, date, title, description }, { new: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while updating the ad" });
    }

    if (!ad) {
        return res.status(404).json({ message: "Unable to update ad details" });
    }
    return res.status(200).json({ ad });
};

const deleteAd = async (req, res, next) => {
    const id = req.params.id;

    let ad;

     try{
        ad = await Ad.findByIdAndDelete(id)
     }catch (err) {
        console.log(err);
     }
     if (!ad) {
        return res.status(404).json({ message: "Unable to delete ad details" });
    }
    return res.status(200).json({ ad });
}




exports.getAllAds = getAllAds;
exports.addAds = addAds;
exports.getById = getById;
exports.updateAd = updateAd;
exports.deleteAd = deleteAd;
exports.shareOnFacebook = shareOnFacebook;