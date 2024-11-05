import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import "./View.css";

const View = () => {
    const [user, setUser] = useState({});

    // Destructure the id from useParams
    const { id } = useParams();

    useEffect(() => { 
        // Update the URL to use your backend URL
        axios.get(`https://react-cloud-host-my-sql-server.vercel.app/api/get/${id}`)
            .then((resp) => setUser({ ...resp.data[0] }))
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [id]);

    return (
        <div style={{ marginTop: "100px" }}>
            <div className='card'>
                <div className='card-header'>
                    <p>{user.name}'s Contact Details</p>
                </div>
                <div className='container'>
                    <strong>ID:</strong>
                    <span>{id}</span>
                    <br />
                    <br />
                    <strong>Name:</strong>
                    <span>{user.name}</span>
                    <br />
                    <br />
                    <strong>Email:</strong>
                    <span>{user.email}</span>
                    <br />
                    <br />
                    <strong>Contact:</strong>
                    <span>{user.contact}</span>
                    <br />
                    <br />
                    <Link to="/">
                        <button className="btn btn-edit">Go Back</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default View;
