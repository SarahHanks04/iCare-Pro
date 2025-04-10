"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit2Icon, LogOut } from "lucide-react";
import { loginSuccess, logout } from "../redux/slices/authSlice";
import Loading from "../loading";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user) || {};
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const email = user.email || "";
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("/images/default-avatar.jpg");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  // Restore state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user.email) {
      const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
      const storedUser =
        mockedUsers.find((u) => u.name && u.email) || mockedUsers[0];
      if (storedUser) {
        dispatch(
          loginSuccess({
            email: storedUser.email,
            name: storedUser.name || "User",
            token,
          })
        );
      } else {
        router.push("/login");
      }
    }
    setIsLoading(false);
  }, [dispatch, router]);

  // Sync formData and avatar with Redux user, but only if authenticated
  useEffect(() => {
    if (isAuthenticated && user.email) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: localStorage.getItem(`phone-${user.email}`) || "",
      });
      setAvatar(
        localStorage.getItem(`avatar-${user.email}`) ||
          "/images/default-avatar.jpg"
      );
    }
  }, [user, isAuthenticated]);

  // Go to login after logout
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setAvatar(base64Image);
        localStorage.setItem(`avatar-${email}`, base64Image);
      };
      reader.readAsDataURL(file);
    }
    setIsEditingAvatar(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(`phone-${email}`, formData.phoneNumber);

    const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
    const userIndex = mockedUsers.findIndex((u) => u.email === email);
    if (userIndex !== -1) {
      mockedUsers[userIndex].name = formData.name;
      mockedUsers[userIndex].email = formData.email;
      localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));
    }

    dispatch(
      loginSuccess({
        email: formData.email,
        name: formData.name,
        token: localStorage.getItem("token"),
      })
    );

    setIsEditingInfo(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: email || "",
      phoneNumber: localStorage.getItem(`phone-${email}`) || "",
    });
    setIsEditingInfo(false);
  };

  const handleLogout = () => {
    dispatch(logout(email));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8 text-center relative">
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
            <div className="relative mx-auto w-32 h-32">
              <Image
                src={avatar}
                alt="Profile Avatar"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Edit2Icon className="h-5 w-5 text-teal-600" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">
              {formData.name || "No Name Provided"}
            </h1>
            <p className="mt-2 text-teal-100">
              {formData.email || "No Email Provided"}
            </p>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Personal Information
              </h2>
              {!isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Edit2Icon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
                      {formData.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  {isEditingInfo ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
                      {formData.email || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      placeholder="+1 (123) 456-7890"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
                      {formData.phoneNumber || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {isEditingInfo && (
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
