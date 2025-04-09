"use client";

import { useSelector } from "react-redux";
import { useState } from "react";
import Sidebar from "../components/sidebar";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImage(data.secure_url);
    } catch (err) {
      setError("Failed to upload image.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p>Email: {user?.email}</p>
          <div className="mt-4">
            <label className="block text-gray-700">Profile Picture</label>
            <input type="file" onChange={handleImageUpload} className="mt-2" />
            {image && (
              <img
                src={image}
                alt="Profile"
                className="mt-4 w-32 h-32 rounded-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
