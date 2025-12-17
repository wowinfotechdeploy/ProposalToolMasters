import React, { useState } from "react";

export default function LiteYouTube({ videoId, className = "", style = {} }) {
  const [showPlayer, setShowPlayer] = useState(false);

  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%", // 16:9 ratio
        borderRadius: "8px",
        overflow: "hidden",
        // backgroundColor: "#060606ff",
        cursor: "pointer",
        ...style,
      }}
      onClick={() => setShowPlayer(true)}
    >
      {showPlayer ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      ) : (
        <>
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt="YouTube thumbnail"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              filter: "brightness(100%)",
            }}
          />

          {/* Play button identical to YouTube's */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
              width: "68px",
              height: "48px",
            //   background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "14%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.15s ease-in-out",
            }}
          >
            <svg
              version="1.1"
              viewBox="0 0 68 48"
              width="68px"
              height="48px"
            >
              <path
                d="M66.52 7.74c-0.76-2.85-2.99-5.08-5.84-5.84C55.76 0.92 34 0.92 34 0.92s-21.76 0-26.68 0.98c-2.85 0.76-5.08 2.99-5.84 5.84C0.5 12.66 0.5 24 0.5 24s0 11.34 0.98 16.26c0.76 2.85 2.99 5.08 5.84 5.84C12.24 47.08 34 47.08 34 47.08s21.76 0 26.68-0.98c2.85-0.76 5.08-2.99 5.84-5.84C67.5 35.34 67.5 24 67.5 24S67.5 12.66 66.52 7.74z"
                fill="#FF0000"
                fillOpacity="0.8"
              />
              <path d="M45 24 27 14v20z" fill="#fff" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
