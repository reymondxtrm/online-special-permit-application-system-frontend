import React from "react";
import QRCode from "react-qr-code";

export default function QrCodeGenerator({ specialPermitId }) {
  const url = `${window.location.protocol}//${process.env.REACT_APP_URL}special-permit-qr-details/${specialPermitId}`;
  return (
    <div>
      <QRCode value={url} size={80} fgColor="#000000" bgColor="#FFFFFF" />
    </div>
  );
}
