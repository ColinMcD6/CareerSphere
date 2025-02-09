import React, { useState } from 'react';
import FetchButton from './components/FetchButton';

function App() {
    const [data, setData] = useState(null);

    const handleDataFetch = (fetchedData) => {
        setData(fetchedData);
    };

    return (
        <div>
            <h1>MERN Stack Application</h1>
            <FetchButton onFetch={handleDataFetch} />
            {data && (
                <div>
                    <h2>Fetched Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;