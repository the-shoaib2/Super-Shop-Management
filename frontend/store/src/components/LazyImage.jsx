import { useState, useEffect } from 'react';

export function LazyImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
  const [imageRef, setImageRef] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc === 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !didCancel) {
            setImageSrc(src);
          }
        },
        {
          rootMargin: '50px',
        }
      );
      observer.observe(imageRef);
    }

    return () => {
      didCancel = true;
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return (
    <div className="relative w-full h-full">
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
