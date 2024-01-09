import Image from "next/image";

const CloseIcon = ({ onClose }) => {
  return (
    <Image
      src="/close.png"
      width={24}
      height={24}
      alt="close icon"
      className="rounded-full"
      onClick={onClose}
    />
  );
};

export default CloseIcon;
