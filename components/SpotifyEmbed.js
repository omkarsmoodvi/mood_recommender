import React from "react";

export default function SpotifyEmbed({ playlistId }) {
  return (
    <div style={{ margin: "20px 0" }}>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="360"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        title="Spotify Playlist"
      ></iframe>
    </div>
  );
}
