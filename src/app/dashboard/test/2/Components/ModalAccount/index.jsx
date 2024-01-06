"use client";
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import SelectAccount from "../_ChildComponents/SelectAccount";
import InputPassword from "../_ChildComponents/InputPassword";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import SubmitButton from "../_ChildComponents/SubmitButton";

const ModalAccount = ({
  isVisible,
  credentialsData,
  closeModal,
  finishModal,
}) => {
  let message = null;
  let color = "green";
  const [userId, setUserId] = useState(1);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const clearStates = () => {
    setUserId(1);
    setOldPassword(null);
    setNewPassword(null);
    setConfirmPassword(null);
    setErrorMessage("");
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
      setErrorMessage(response.message);
    } else {
      message = "Password berhasil diubah";
      clearStates();
      finishModal(message, color);
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
      <div className="bg-white p-6 rounded-l-2xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-5">
            <Title title={"Account Setting"} />
            <CloseIcon
              onClose={() => {
                clearStates();
                closeModal();
              }}
            />
          </div>

          <div className="mb-3">
            <SelectAccount
              credentialsData={credentialsData}
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

          <div className="h-6">
            <ErrorMessage message={errorMessage} />
          </div>
        </div>

        <div>
          <SubmitButton label={"Save"} getSubmit={submitHandler} />
        </div>
      </div>
    </div>
  );
};

export default ModalAccount;
