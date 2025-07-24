export const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
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
      
      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // Check if compressed image is still too large (roughly 800KB limit for base64)
              if (result.length > 800000) {
                // Try with more compression
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
                  0.5 // More aggressive compression
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