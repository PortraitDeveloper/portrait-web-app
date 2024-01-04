"use client";
import { useState } from "react";
import Title from "./ChildComponents/Title";
import CloseIcon from "./ChildComponents/CloseIcon";
import SelectAccount from "./ChildComponents/SelectAccount";
import InputPassword from "./ChildComponents/InputPassword";
import SubmitButton from "./ChildComponents/SubmitButton";

const ModalAccount = ({ isVisible, closeModal }) => {
  const [userId, setUserId] = useState(1);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [message, setMessage] = useState("");

  const clearStates = () => {
    setUserId(1);
    setOldPassword(null);
    setNewPassword(null);
    setConfirmPassword(null);
    setMessage("");
  };

  const submitHandler = async () => {
    const body = {
      user_id: userId,
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    let response = await fetch("/api/credential", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    response = await response.json();

    if (response.status === 401) {
      setMessage(response.message);
    } else {
      const message = "Password berhasil diubah";
      const color = "green";
      clearStates();
      closeModal(message, color);
    }
  };

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      clearStates();
      closeModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="container"
      onClick={closeHandler}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-end"
    >
      <div className="bg-white p-6 rounded-l-2xl">
        <div className="flex justify-between items-center mb-5">
          <Title />
          <CloseIcon
            onClose={(e) => {
              clearStates();
              closeModal();
            }}
          />
        </div>

        <div className="mb-3">
          <SelectAccount
            getUserId={(e) => {
              setUserId(e);
            }}
          />
        </div>

        <div className="mb-3">
          <InputPassword
            placeHolder={"Password Lama"}
            getPassword={(e) => {
              setOldPassword(e);
            }}
          />
        </div>

        <div className="mb-3">
          <InputPassword
            placeHolder={"Password Baru"}
            getPassword={(e) => {
              setNewPassword(e);
            }}
          />
        </div>

        <div className="mb-3">
          <InputPassword
            placeHolder={"Konfirmasi Password Baru"}
            getPassword={(e) => {
              setConfirmPassword(e);
            }}
          />
        </div>

        <div className="h-6 mb-60">
          <p className="text-sm text-center font-bold font-sora text-red-500">
            {message}
          </p>
        </div>

        <SubmitButton getSubmit={submitHandler} />
      </div>
    </div>
  );
};

export default ModalAccount;
