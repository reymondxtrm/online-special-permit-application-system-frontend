import React from "react";
import QRCode from "react-qr-code";

export default function QrCodeGenerator({ specialPermitId, size = 80 }) {
  const url = `${window.location.protocol}//${process.env.REACT_APP_URL}special-permit-qr-details/${specialPermitId}`;
  return (
    <div>
      <QRCode value={url} size={size} fgColor="#000000" bgColor="#FFFFFF" />
    </div>
  );
}
