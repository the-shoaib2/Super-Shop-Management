import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },
  {
    url: 'https://images.unsplash.com/photo-1611776246-c4add6822d7f?q=80&w=2069&auto=format&fit=crop',
    title: 'Premium Billiard Tables',
    description: 'Tournament-grade tables for the perfect game'
  },
  {
    url: 'https://images.unsplash.com/photo-1609726121380-243fcdbb1935?q=80&w=2070&auto=format&fit=crop',
    title: 'Expert Accessories',
    description: 'Everything you need for your game'
  }
];

export function Billboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('left');
  const [isAnimating, setIsAnimating] = useState(false);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTimeout(() => {
      setIsAnimating(false);
      setDirection('left');
    }, 750);
  }, [currentIndex, isAnimating]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 750);
  }, [currentIndex, isAnimating]);

  const goToSlide = (slideIndex) => {
    if (isAnimating || slideIndex === currentIndex) return;
    setIsAnimating(true);
    setDirection(slideIndex > currentIndex ? 'left' : 'right');
    setCurrentIndex(slideIndex);
    setTimeout(() => {
      setIsAnimating(false);
      setDirection('left');
    }, 200);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{ backgroundImage: `url(${slide.url})` }}
            className={`absolute top-0 left-0 w-full h-full bg-center bg-cover transition-transform duration-700 ease-out ${
              index === currentIndex
                ? 'translate-x-0 opacity-100'
                : direction === 'left'
                ? 'translate-x-full opacity-0'
                : '-translate-x-full opacity-0'
            }`}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30">
              <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                <h1 
                  className={`text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700 ${
                    index === currentIndex ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'
                  }`}
                >
                  {slide.title}
                </h1>
                <p 
                  className={`text-xl md:text-2xl text-white/90 transition-all duration-700 delay-100 ${
                    index === currentIndex ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'
                  }`}
                >
                  {slide.description}
                </p>
                <Button 
                  size="lg" 
                  className={`mt-8 w-fit rounded-full text-lg transition-all duration-700 delay-200 ${
                    index === currentIndex ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'
                  }`}
                  onClick={() => window.location.href = '/products'}
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-200"
          onClick={prevSlide}
          disabled={isAnimating}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-200"
          onClick={nextSlide}
          disabled={isAnimating}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`
                transition-all w-3 h-3 rounded-full cursor-pointer
                ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}
                ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
