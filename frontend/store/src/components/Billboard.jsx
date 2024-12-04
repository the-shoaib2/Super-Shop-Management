import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
    url: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop',
    title: 'Professional Pool Equipment',
    description: 'High-quality cues, balls, and accessories'
  },  {
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
    }, 750);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden px-8 md:px-6 lg:px-8 my-8">
      {/* Slides Container */}
      <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30">
              <div className="container h-full mx-auto px-6 md:px-8 flex flex-col justify-center items-center text-center">
                <h1 
                  className={`text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700 ${
                    index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                  }`}
                >
                  {slide.title}
                </h1>
                <p 
                  className={`text-xl md:text-2xl text-white/90 transition-all duration-700 delay-100 max-w-2xl ${
                    index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
                  }`}
                >
                  {slide.description}
                </p>
                <Button 
                  size="lg" 
                  className={`mt-8 w-fit rounded-full text-lg transition-all duration-700 delay-200 hover:scale-105 ${
                    index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-[50px] opacity-0'
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
      <div className="absolute inset-y-0 left-10 right-10 flex items-center justify-between pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white transition-all duration-300 pointer-events-auto transform hover:scale-90 active:scale-75"
          onClick={prevSlide}
          disabled={isAnimating}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white transition-all duration-300 pointer-events-auto transform hover:scale-90 active:scale-75"
          onClick={nextSlide}
          disabled={isAnimating}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0">
        <div className="flex items-center justify-center gap-3">
          {slides.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`
                w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300
                ${currentIndex === slideIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'}
                ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
