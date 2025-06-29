import React, { useState, useContext } from 'react';
import axios from "axios";
import "./createDesign.css";
import Title from "../../components/Title/Title";
import shopContext from '../../context/shopContext';

const TextToImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailFormVisible, setIsDetailFormVisible] = useState(false);
    const [details, setDetails] = useState({
        name: '',
        description: '',
        category: '',
    });

    const { backendURL, token } = useContext(shopContext);

    const generateImage = async () => {
        if (!prompt) {
            alert("Please enter a text prompt!");
            return;
        }

        setIsLoading(true);
        setImageUrl(null);
        setErrorMessage('');
        setIsDetailFormVisible(false);

        try {
            const response = await axios.post(`${backendURL}/api/generate-image`, { prompt }, {
                headers: { token }
            });

            if (response.status === 200) {
                const { data } = response.data;
                if (data && data.imageUrl) {
                    setImageUrl(data.imageUrl);
                    setIsDetailFormVisible(true); // Show detail form
                } else {
                    setErrorMessage("Image URL not found in response.");
                }
            } else {
                setErrorMessage(response.data.message || "Something went wrong!");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveDesign = async () => {
        if (!details.name || !details.description || !details.category) {
            alert("Please fill in all the details before saving!");
            return;
        }

        try {
            const response = await axios.post(`${backendURL}/api/save-design`, {
                prompt,
                imageUrl,
                ...details
            }, {
                headers: { token }
            });

            if (response.status === 200) {
                alert("Design saved successfully!");
                setPrompt('');
                setImageUrl(null);
                setDetails({ name: '', description: '', category: '' });
                setIsDetailFormVisible(false);
            } else {
                setErrorMessage(response.data.message || "Failed to save design.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to save design. Please try again.');
        }
    };

    const handleDetailChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    return (
        <div className='createPage'>
            <div className='createPageContainer'>
                <Title text1={"Create Your"} text2={"Custom Image"} />
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a text prompt"
                    className='aiImgCreateTextArea'
                />
                <button onClick={generateImage}>
                    {isLoading ? "Generating..." : "Generate Image"}
                </button>

                <div className="imgAndForm">
                    {isLoading && <p >Generating image...</p>}
                    <div>
                    <p>Prompt: <strong>{prompt}</strong></p>
                    <div className='aiImgAndContext'>
                        <div className='AiImage'>
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            {imageUrl && (
                                <>
                                    <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', height: 'auto' }} />
                                </>
                            )}
                        </div>

                        {isDetailFormVisible && (
                            <div className="detailsForm">
                                <Title text1={"Enter Design"} text2={"Details"} />
                                <div className='aiImgInputField'>
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
                                    name="description"
                                    placeholder="Design Description"
                                    value={details.description}
                                    onChange={handleDetailChange}
                                    className='aiImgDescription'
                                />
                                <button onClick={saveDesign}>Save Design</button>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToImageGenerator;