import imageCompression from 'browser-image-compression';

export function imageValidation(file) {

    if (file) {

      console.log(file);
      // Allowing file type
      const allowedExtensions =
        /(\/jpg|\/jpeg|\/png|\/PNG|\/JPG|\/JPEG)$/i;
  
      if (!allowedExtensions.exec(file.type) || file.size > 2000000) {
        return false;
      }
      
      return true;
    
    }
   
    return false;
    
  }
  
export async function resizeImage(file, MaxWidth) {

  console.log(file);
  
    const options = {
      maxWidthOrHeight: MaxWidth,
    }
  
    const ResizedImage = await imageCompression(file, options);
  
    return ResizedImage;
}