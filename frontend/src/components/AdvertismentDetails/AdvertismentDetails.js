import React, { useEffect, useState } from "react";
import Nav from "../Nav2/Nav2";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const URL = "http://localhost:8070/ads";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

function AdvertismentDetails() {
  const [advertisementDetails, setAdvertisementDetails] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndDeleteExpiredAds = async () => {
      const data = await fetchHandler();
      const currentAds = data.ads;
      const today = new Date().toISOString().split('T')[0];

      const validAds = [];
      for (const ad of currentAds) {
        const adDate = formatDate(ad.date);
        if (adDate < today) {
          await handleDelete(ad._id);
        } else {
          validAds.push(ad);
        }
      }

      setAdvertisementDetails(validAds);
    };

    fetchAndDeleteExpiredAds();
  }, []);

  const handleEdit = (id) => {
    const confirmEdit = window.confirm("Are you sure you want to update this advertisement?");
    if (!confirmEdit) return;

    navigate(`/update-advertisement/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this advertisement?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${URL}/${id}`);
      setAdvertisementDetails((prevAds) => prevAds.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    }
  };

  const filteredAdvertisements = advertisementDetails.filter(ad => {
    const normalizedInput = searchInput.toLowerCase();
    const matchesTitle = ad.title.toLowerCase().includes(normalizedInput);
    const matchesDate = formatDate(ad.date) === normalizedInput;
    return matchesTitle || matchesDate;
  });

  const getImageData = async (url) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return '';
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.text('Advertisement Details', 14, 16);
    const columns = ['Image', 'Title', 'Date', 'Description'];
    const rows = [];

    for (const ad of filteredAdvertisements) {
      const imageData = await getImageData(ad.image);
      if (imageData) {
        rows.push([imageData, ad.title, formatDate(ad.date), ad.description]);
      } else {
        rows.push(['No Image', ad.title, formatDate(ad.date), ad.description]);
      }
    }

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
      },
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.raw && data.cell.raw.startsWith('data:image')) {
          const { x, y, width, height } = data.cell;
          const image = data.cell.raw;
          const imgWidth = 30; // Width in mm
          const imgHeight = (imgWidth * height) / width; // Maintain aspect ratio
          doc.addImage(image, 'JPEG', x + 2, y + 2, imgWidth, imgHeight);
        }
      },
    });

    doc.save('advertisement_details.pdf');
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Nav />
      <div style={{ flex: 1, padding: "20px", marginLeft: "250px", boxSizing: "border-box" }}>
        <h1>Advertisement Details</h1>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by title or date (YYYY-MM-DD)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
              width: "300px",
              transition: "border-color 0.3s"
            }}
          />
          <button onClick={generatePDF} style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Generate PDF
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #dad2d2", backgroundColor: "#f4f4f4", fontWeight: "bold" }}>Image</th>
                <th style={{ padding: "10px", border: "1px solid #dad2d2" }}>Title</th>
                <th style={{ padding: "10px", border: "1px solid #dad2d2" }}>Description</th>
                <th style={{ padding: "10px", border: "1px solid #dad2d2" }}>Date</th>
                <th style={{ padding: "10px", border: "1px solid #dad2d2" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvertisements.length > 0 ? (
                filteredAdvertisements.map((advertisement) => (
                  <tr key={advertisement._id} style={{ transition: "background-color 0.3s" }}>
                    <td style={{ padding: "10px", border: "1px solid #dad2d2" }}>
                      <img
                        src={advertisement.image}
                        alt={advertisement.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #dad2d2" }}>{advertisement.title}</td>
                    <td style={{ padding: "10px", border: "1px solid #dad2d2" }}>{advertisement.description}</td>
                    <td style={{ padding: "10px", border: "1px solid #dad2d2" }}>{formatDate(advertisement.date)}</td>
                    <td style={{ padding: "10px", border: "1px solid #dad2d2" }}>
                      <button style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: "#28a745",
                        color: "white",
                        cursor: "pointer",
                        marginRight: "10px"
                      }} onClick={() => handleEdit(advertisement._id)}>Update</button>
                      <button style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        cursor: "pointer"
                      }} onClick={() => handleDelete(advertisement._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No advertisements found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdvertismentDetails;
