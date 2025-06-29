import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import shopContext from "../../context/shopContext";
import "react-toastify/dist/ReactToastify.css"; 
import "./savedDesign.css"; 
import SavedDesignCard from "../../components/savedDesignCard/SavedDesignCard";

const SavedDesign = () => {
    const { backendURL } = useContext(shopContext); 
    const [savedImgs, setSavedImgs] = useState([]);

    // Fetch saved images from the backend
    const fetchSavedImgs = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/get-image`);
            if (response.data.success) {
                setSavedImgs(response.data.message); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch saved images");
        }
    };

    useEffect(() => {
        fetchSavedImgs();
    }, []); 

    return (
        <div className="saved-design-container">
            {/* Design Grid */}
            <div className="design-grid">
                {savedImgs.length > 0 ? (
                    savedImgs.map((img) => (
                        <SavedDesignCard key={img._id} imgId={img._id} imgUrl={img.imageUrl} imgStatus={img.imgStatus}/>
                    ))
                ) : (
                    <p className="no-images-message">No images available.</p>
                )}
            </div>
        </div>
    );
};

export default SavedDesign;