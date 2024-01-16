const ClipboardCopyLink = ({ copyLink, onFinish }) => {
  let message = "";
  let color = "";

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(copyLink)
      .then(() => {
        message = "Link copied to clipboard";
        color = "green";
        onFinish(message, color);
      })
      .catch((err) => {
        message = `Failed to copy text to clipboard: ${err}`;
        color = "red";
        onFinish(message, color);
      });
  };

  return (
    <button
      className="bg-blue-900 rounded-3xl px-3 py-2 text-sm w-full text-white hover:bg-blue-700"
      onClick={handleCopyToClipboard}
    >
      Copy Payment Link
    </button>
  );
};

export default ClipboardCopyLink;
