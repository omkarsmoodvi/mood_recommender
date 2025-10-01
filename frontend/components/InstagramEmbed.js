import React from "react";

export default function InstagramEmbed({ postUrl }) {
  return (
    <div style={{ margin: "20px 0" }}>
      <iframe
        src={`https://www.instagram.com/p/${postUrl}/embed`}
        width="360"
        height="480"
        frameBorder="0"
        scrolling="no"
        allowTransparency={true}
        title="Instagram Post"
        style={{ borderRadius: 12, background: '#fff' }}
      ></iframe>
    </div>
  );
}
