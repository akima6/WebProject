import { useState } from 'react';
import axios from 'axios';

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
          },
        }
      );

      setCid(res.data.IpfsHash);
      setError('');
      // Here you would typically send the CID to your blockchain
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin Certificate Upload</h1>
      
      <form onSubmit={uploadToIPFS} className="space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-2">
            Select Certificate:
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full border rounded-md p-2"
              accept=".pdf,.jpg,.png"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Uploading...' : 'Upload to IPFS'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        
        {cid && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="font-semibold">IPFS CID:</p>
            <p className="break-words">{cid}</p>
            <p className="mt-2">
              View file: 
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Open Certificate
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminUpload;