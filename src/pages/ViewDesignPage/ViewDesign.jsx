import "./viewDesign.css"
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useContext } from "react"
import shopContext from "../../context/shopContext"

export default function ViewDesign() {
    const { backendURL } = useContext(shopContext);
    const { imgId } = useParams();
    const [singleImage, setSingleImage] = useState("");
    const navigate = useNavigate();

    const gettingSingleDesign = async () => {
        try {
            const response = await axios.get(`${backendURL}/api/getSingleDesign`, {
                params: { imgId }
            });
            if (response.data.success) {
                setSingleImage(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleDeleteDesign = async (id) => {
        try {
            const response = await axios.post(backendURL + "/api/deleteDesign", { imgId: id });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    useEffect(() => {
        gettingSingleDesign();
    }, [imgId]);

    return (
        <div className="ViewDesignSection">
            {singleImage ? (
                <div className="viewImgSection">
                    <div className="imageSection">
                        <img src={singleImage.imageUrl} alt="Design" />
                    </div>
                    <div className="imgContextSecton">
                        {/* Image Name */}
                        <h2 className="imageName">{singleImage.name}</h2>

                        {/* Single Image Status */}
                        <p className="imageStatus">
                            Status : {singleImage.imgStatus}
                        </p>
                        {/* Image description */}
                        <p className="imageCategory">Category: {singleImage.category}</p>
                        <p className="promptPara"><strong>Prompt:</strong> {singleImage.prompt}</p>
                        <p className="imageDescription"><strong>Description:</strong>{singleImage.description}</p>
                        <div className="imgActionBtns">
                            <button className="savedDesignBtn" id="deleteDesignBtn" onClick={() => handleDeleteDesign(imgId)}>Delete</button>
                            <button id="editDesignBtn" className="savedDesignBtn" onClick={()=>navigate(`/edit/${singleImage._id}`)}>Edit</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Image not found</p>
            )}
        </div>
    );
}
