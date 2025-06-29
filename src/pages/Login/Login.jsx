import "./login.css"
import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import shopContext from "../../context/shopContext";
import { toast } from "react-toastify";
export default function Login() {
    const navigate = useNavigate();
    const { backendURL, token, setToken } = useContext(shopContext)
    const [currentState, setCurrentState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleForm = async (e) => {
        e.preventDefault();
        try {
            if (currentState === "Sign Up") {
                const response = await axios.post(backendURL + "/api/user/register", { name, email, password })
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    // console.log(response.data);
                } else {
                    toast.error(response.data.message)
                }
            } else {
                const response = await axios.post(backendURL + "/api/user/login", { email, password })
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    // console.log(response.data);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            navigate("/")
        }
    }, [token])

    return (
        <>
            <div className="loginSection">
                <div className="loginSignUpBox">
                    {
                        currentState === "login" ?
                            <div className="loginHead">
                                <h1 className="prata-regular">Login</h1>
                                <p className="line"></p>
                            </div>
                            :
                            <div className="loginHead">
                                <h1 className="prata-regular">Sign Up</h1>
                                <p className="line"></p>
                            </div>
                    }
                    <form onSubmit={handleForm} className="loginForm">
                        {
                            currentState === "login"
                                ?
                                ""
                                :
                                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                        }
                        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <div className="forGodPasswordDiv">
                            <p>Forgot your password?</p>
                            {currentState === "login" ?
                                <p onClick={() => setCurrentState("Sign Up")}>Create Account</p>
                                :
                                <p onClick={() => setCurrentState("login")}>Login</p>
                            }
                        </div>
                        {
                            currentState === "login"
                                ?
                                <button type="submit" id="loginBtn">Sign In</button>
                                :
                                <button type="submit" id="loginBtn">Sign Up</button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}