import React, { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import axios from 'axios';


const Item = () => {
    const { id } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBid, setNewBid] = useState("");
    const [bids, setBids] = useState([]);
    const [bidError, setBidError] = useState("");
    const [bidCount, setBidCount] = useState(0);
    const [highestBid, setHighestBid] = useState(0);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/item/${id}`);
                setItemDetails(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchOngoingBids = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/item/${id}/bids`);
                const bidAmounts = response.data.map(bid => bid.amount);
                setBids(bidAmounts);
                setBidCount(bidAmounts.length);
                setHighestBid(Math.max(...bidAmounts, 0));
            } catch (error) {
                console.error('Error fetching bids:', error);
            }
        };

        fetchItemDetails();
        fetchOngoingBids();
    }, [id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        const bidValue = parseFloat(newBid);
        const lastBid = bids.length > 0 ? Math.max(...bids) : itemDetails.startingPrice;

        if (bidValue > lastBid) {
            try {
                await axios.post(`http://localhost:8070/item/${id}/bids`, { amount: bidValue });
                setBids([...bids, bidValue]);
                setBidCount(prevCount => prevCount + 1);
                setHighestBid(bidValue); // Update the highest bid directly
                setNewBid("");
                setBidError("");
            } catch (error) {
                setBidError('Error submitting bid');
            }
        } else {
            setBidError(`Bid must be greater than the last bid of $${lastBid}`);
        }
    };

    if (loading) return <p className="text-center">Loading item details...</p>;
    if (error) return <p className="text-danger text-center">Error: {error}</p>;

    const isAuctionClosed = bidCount >= 10;
    const isHighestBidder = highestBid === Math.max(...bids, 0);

    return (
        <div className="container mt-4">
            <main className="row">
                <div className="col-md-8">
                    {itemDetails ? (
                        <div className="card mb-3">
                            <img src={itemDetails.images[0].data} alt={itemDetails.name} className="card-img-top img-fluid" style={{ width: "50%" }} />
                            <div className="card-body">
                                <h2 className="card-title">{itemDetails.name}</h2>
                                <p className="card-text">{itemDetails.description}</p>
                                <p className="h5 text-primary">
                                    Starting bidding price: <strong>${itemDetails.startingPrice}</strong>
                                </p>
                                <form onSubmit={handleBidSubmit}>
                                    <input
                                        type="number"
                                        value={newBid}
                                        onChange={(e) => setNewBid(e.target.value)}
                                        placeholder="Enter your bid"
                                        className="form-control mb-2"
                                        required
                                        disabled={isAuctionClosed}
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={isAuctionClosed}>
                                        Place Bid
                                    </button>
                                </form>
                                {bidError && <p className="text-danger">{bidError}</p>}
                                {isAuctionClosed && isHighestBidder && (
                                    <button className="btn btn-success mt-2">
                                        <Link
                                        to="/payment"
                                        style={
                                            {
                                                textDecoration: 'none',
                                                color:"white"
                                            }
                                        }
                                        >
                                            Buy Item
                                        </Link>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>No item details found.</p>
                    )}
                </div>
                <div className="col-md-4">
                    <h2 className="h5 mb-3">Ongoing Bids</h2>
                    <div className="list-group">
                        {bids.length > 0 ? (
                            bids.map((bid, index) => (
                                <a key={index} href="#" className="list-group-item list-group-item-action">
                                    ${bid}
                                </a>
                            ))
                        ) : (
                            <p className="list-group-item">No ongoing bids</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Item;
