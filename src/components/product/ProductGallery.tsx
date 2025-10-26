import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Modal } from '../common/Modal';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={images[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Zoom image"
        >
          <ZoomIn size={20} />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`
                aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${
                  selectedImage === index
                    ? 'border-indigo-600 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Modal
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
        size="full"
        showCloseButton={true}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <img
            src={images[selectedImage]}
            alt={`${productName} - Zoomed`}
            className="max-w-full max-h-screen object-contain"
          />
        </div>
      </Modal>
    </div>
  );
};