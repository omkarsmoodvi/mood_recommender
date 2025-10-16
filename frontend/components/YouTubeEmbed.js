import React from "react";

export default function YouTubeEmbed({ videoId }) {
  return (
    <div style={{ margin: "20px 0" }}>
      <iframe
        width="360"
        height="215"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
