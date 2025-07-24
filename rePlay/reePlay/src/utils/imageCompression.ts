export const compressImage = (file: File, maxWidth: number = 600, maxHeight: number = 400, quality: number = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with compression - more aggressive compression for multiple images
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // More strict size limit for base64 to allow multiple images (150KB per image)
              if (result.length > 150000) {
                // Try with even more compression
                canvas.toBlob(
                  (secondBlob) => {
                    if (secondBlob) {
                      const secondReader = new FileReader();
                      secondReader.onload = () => resolve(secondReader.result as string);
                      secondReader.onerror = reject;
                      secondReader.readAsDataURL(secondBlob);
                    } else {
                      reject(new Error('Failed to compress image further'));
                    }
                  },
                  'image/jpeg',
                  0.3 // Very aggressive compression
                );
              } else {
                resolve(result);
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageSize = (file: File): boolean => {
  // Check if file is larger than 10MB
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
};