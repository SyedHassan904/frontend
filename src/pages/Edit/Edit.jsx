import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import shopContext from "../../context/shopContext";
import "./edit.css";
import Title from "../../components/Title/Title";

const EditDesign = () => {
    const { backendURL, token } = useContext(shopContext);
    const { imgId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        name: "",
        description: "",
        category: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchDesign = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/getSingleDesign`, {
                    params: { imgId },
                    headers: { token },
                });
                if (response.data.success) {
                    const { message: design } = response.data;
                    setDetails({
                        name: design.name,
                        description: design.description,
                        category: design.category,
                    });
                } else {
                    setErrorMessage("Failed to fetch design details.");
                }
            } catch (error) {
                console.error(error);
                setErrorMessage("Error fetching design details.");
            }
        };

        fetchDesign();
    }, [imgId, backendURL, token]);

    const handleDetailChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const updateDesign = async () => {
        if (!details.name || !details.description || !details.category) {
            alert("Please fill in all the details before saving!");
            return;
        }

        try {
            const response = await axios.post(
                `${backendURL}/api/edit-design`,
                { imgId, ...details },
                { headers: { token } }
            );

            if (response.status === 200) {
                alert("Design updated successfully!");
                navigate("/");
            } else {
                setErrorMessage(response.data.message || "Failed to update design.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Error updating design.");
        }
    };

    return (
        <div className="editPage">
            <div className="editPageContainer">
                <div className="editPageContainerContext">
                <Title text1="Edit Your" text2="Design" />
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <div className="editPageInputField">
                    <input
                        type="text"
                        name="name"
                        placeholder="Design Name"
                        value={details.name}
                        onChange={handleDetailChange}
                    />
                    <select
                        name="category"
                        value={details.category}
                        onChange={handleDetailChange}
                    >
                        <option value="">Select Category</option>
                        <option value="Shuttle Lace">Shuttle Lace</option>
                        <option value="Fancy Lace">Fancy Lace</option>
                        <option value="Patches">Patches</option>
                    </select>
                </div>
                <textarea
                className="editDescription"
                    name="description"
                    placeholder="Design Description"
                    value={details.description}
                    onChange={handleDetailChange}
                />
                <button id="editPageBtn" onClick={updateDesign}>Update Design</button>
                </div>
            </div>
        </div>
    );
};

export default EditDesign;
