import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);  //stores files selected
  const [images, setImages] = useState([]);  // Stores the list of random image URLs fetched
  const [dogImage, setDogImage] = useState(''); //Stores the single dog image

  const handleFileChange = e => setSelectedFiles(e.target.files);  //contains the selected files and update

  const uploadImages = async () => {
    const formData = new FormData();  //object send files in a POST request
    for (let file of selectedFiles) formData.append('images', file);
    //Sends a POST request to the server with the files using fetch.
    await fetch('http://localhost:5000/upload-multiple', {
      method: 'POST',
      body: formData
    });
    alert('Uploaded successfully'); //pop-up message
  };
//Function to get random images
  const fetchRandomImages = async () => {
    const res = await fetch('http://localhost:5000/random-images');
    const data = await res.json(); //Parses the response as JSON
    setImages(data); //Updates the images state
  };

//Function to get a random dog image from an external API.
  const fetchDogImage = async () => {
    const res = await fetch('https://dog.ceo/api/breeds/image/random'); //Function to get a random dog image from an external API.
    const data = await res.json();
    setDogImage(data.message); //data.message contains the dog image
  };

  //Function to send the dog image URL to server.
  const uploadDogImage = async () => {
    //Sends the image URL in JSON format
    await fetch('http://localhost:5000/upload-dog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: dogImage })
    });
    alert('Dog image uploaded');
  };
//returned all component
  return (
    <div className="App">
      <h2>Upload Multiple Images</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadImages}>Upload</button>

      <h2>Get Random Images from Server</h2>
      <button onClick={fetchRandomImages}>Fetch Random Images</button>
      <div className="gallery">
        {images.map((src, i) => <img key={i} src={src} alt="random" />)}
      </div>

      <h2>Random Dog Image</h2>
      <button onClick={fetchDogImage}>Get Dog Image</button>
      {dogImage && <div>
        <img src={dogImage} alt="dog" style={{ width: 300 }} />
        <br />
        <button onClick={uploadDogImage}>Upload Dog Image to Server</button>
      </div>}
    </div>
  );
}

export default App;
