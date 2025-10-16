import React from "react";

/**
 * Advanced YouTube Embed Component
 * - id: Video ID, Playlist ID, or Channel/User ID
 * - embedType: "video", "playlist", or "channel"
 * - large: boolean for size
 */
export default function YouTubeEmbed({ id, embedType = "video", large }) {
  let src = "";
  
  if (embedType === "video") {
    src = `https://www.youtube.com/embed/${id}`;
  } else if (embedType === "playlist") {
    src = `https://www.youtube.com/embed/videoseries?list=${id}`;
  } else if (embedType === "channel") {
    src = `https://www.youtube.com/embed?listType=user_uploads&list=${id}`;
  }

  return (
    <div>
      <iframe
        className={large ? "responsive-youtube-iframe-large" : ""}
        width={large ? "312" : "220"}
        height={large ? "186" : "124"}
        src={src}
        title="YouTube Embed"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
