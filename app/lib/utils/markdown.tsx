export const renderTextWithMedia = (text: string) => {
  const parts = text.split(/(!\[[^\]]*\]\([^)]+\)|\[[^\]]*\]\([^)]+\))/g);

  return parts.map((part, idx) => {
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

    const linkMatch = part.match(/\[([^\]]*)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      const cleanUrl = url.replace(/\?utm_source=openai$/, "");

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

    return <span key={idx}>{part}</span>;
  });
};
