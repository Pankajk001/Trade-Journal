import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn } from 'react-icons/fi';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedImage(img.url)}>
            <img src={img.url} alt={img.title} className="w-full h-48 object-cover rounded-lg border border-gray-700" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <FiZoomIn className="text-white text-3xl" />
            </div>
            <p className="text-center text-gray-400 mt-2 text-sm">{img.title}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300">
              <FiX />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Fullscreen Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
