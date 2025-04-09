"use client";

import { useState } from "react";
import AddUserModal from "./add-users";

export default function AddUserButton({ onUserAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="btn flex items-center cursor-pointer gap-2 bg-[#11453B] text-[#F0F7EB80] hover:bg-[#11453B]/80"
      >
        <span className="text-lg">+</span>
        <span className="text-xs">Add User</span>
      </button>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUserAdded={onUserAdded}
      />
    </>
  );
}
