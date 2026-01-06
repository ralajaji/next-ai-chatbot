import React from "react";

/**
 * Renders text with inline images, converting markdown image/link syntax to actual img elements
 */
export const renderTextWithMedia = (text: string) => {
  // Split by markdown images ![alt](url) and links [text](url)
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\)|\[[^\]]*\]\([^)]+\))/g);

  return parts.map((part, idx) => {
    // Check if this is a markdown image ![alt](url)
    const imageMatch = part.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      const [, altText, url] = imageMatch;
      const cleanUrl = url.replace(/\?utm_source=openai$/, "");
      return (
        <span key={idx} className="block my-3">
          <img
            src={cleanUrl}
            alt={altText}
            className="rounded-lg max-w-full max-h-80 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </span>
      );
    }

    // Check if this is a markdown link [text](url)
    const linkMatch = part.match(/\[([^\]]*)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      const cleanUrl = url.replace(/\?utm_source=openai$/, "");

      // Render as image (hide if it fails to load)
      return (
        <span key={idx} className="block my-3">
          <img
            src={cleanUrl}
            alt={linkText}
            className="rounded-lg max-w-full max-h-80 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </span>
      );
    }

    // Regular text
    return <span key={idx}>{part}</span>;
  });
};
