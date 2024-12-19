import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageItems() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:8070/item'); // Update with your endpoint
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    const deleteItem = async (name) => {
        try {
            const response = await axios.delete(`http://localhost:8070/item/delete/${name}`);
            alert(response.data.message);
            setItems(items.filter(item => item.name !== name)); // Remove the deleted item from state
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div>
            <h1>Manage Items</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Starting Price</th>
                        <th>Seller Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.startingPrice}</td>
                            <td>{item.registeredSeller ? item.registeredSeller._id : 'N/A'}</td> {/* Ensure seller data is available */}
                            <td>{item.description}</td>
                            <td>
                                <button onClick={() => deleteItem(item.name)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
