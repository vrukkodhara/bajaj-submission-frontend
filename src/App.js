import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const App = () => {
  const [jsonData, setJsonData] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');
  const [getRequestData, setGetRequestData] = useState(null); // State to store GET request response

  const options = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  // Handle form submission for POST request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonData); // Validate JSON
      const response = await axios.post('http://localhost:3000/bfhl', {
        data: parsedJson.data,
        file_b64: parsedJson.file_b64 || ''
      });
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON or error from backend');
    }
  };

  // Handle GET request
  const handleGetRequest = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bfhl');
      setGetRequestData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Render selected data based on dropdown selection
  const renderFilteredData = () => {
    if (!responseData) return null;

    return selectedOptions.map((option) => (
      <div key={option.value}>
        <h3>{option.label}</h3>
        <pre>{JSON.stringify(responseData[option.value], null, 2)}</pre>
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>BFHL Challenge</h1>

      {/* Input field for JSON */}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder='Enter JSON { "data": ["A", "C", "z"] }'
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      {/* Ensure this div wraps the button correctly */}
      <div style={{ marginTop: '20px' }}>
        {/* Button to trigger GET request */}
        <button onClick={handleGetRequest} style={{ padding: '10px 20px' }}>
          Fetch GET Request Data
        </button>
      </div>

      {/* Display GET request response */}
      {getRequestData && (
        <div>
          <h2>GET Request Response</h2>
          <pre>{JSON.stringify(getRequestData, null, 2)}</pre>
        </div>
      )}

      {/* Response dropdown filter */}
      {responseData && (
        <div>
          <h2>Select Data to Display</h2>
          <Select
            isMulti
            options={options}
            onChange={setSelectedOptions}
          />
        </div>
      )}

      {/* Render filtered response */}
      <div>
        {renderFilteredData()}
      </div>
    </div>
  );
};

export default App;
