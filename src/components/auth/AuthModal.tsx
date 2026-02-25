"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "../modal/AlertModal";

const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    // Clear cookies if needed or just redirect to login
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/signin"); // Existing route might be /signin based on typical templates
  };

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      type="error"
      title="Sesi Habis"
      message="Sesi login Anda telah habis. Silakan login kembali untuk melanjutkan."
      confirmText="Login Kembali"
      onConfirm={handleConfirm}
    />
  );
};

export default AuthModal;
