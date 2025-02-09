import React from 'react';
import axios from 'axios';

const FetchButton = () => {
    const handleFetchData = async () => {
        try {
            const response = await axios.get('/data');
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <button onClick={handleFetchData}>
            Fetch Data
        </button>
    );
};

export default FetchButton;