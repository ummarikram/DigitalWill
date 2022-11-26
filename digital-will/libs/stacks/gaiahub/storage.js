import { userSession } from '../auth/auth';
import { Storage } from '@stacks/storage';
import { isSignedIn } from '../auth/auth';

const USER_PROFILE_PIC = 'USER_PROFILE_PIC.jpg'

const imageFileOptions = {
    encrypt: false,
    contentType: "image/jpg",
    dangerouslyIgnoreEtag: true,
  };

export async function saveUserPic(userPic) {

    try {
  
        if (isSignedIn()) {

            const storage = new Storage({ userSession });
            return await storage.putFile(USER_PROFILE_PIC, userPic, imageFileOptions);

        }

        return null;
    }
    catch(err){
        console.log(error)
        return null;
    }
}


export async function fetchUserPic() {

    try {
  
      if (isSignedIn()) {

          const storage = new Storage({ userSession });

          const userPic = await storage.getFile(USER_PROFILE_PIC, { decrypt: false});
          
          if (userPic) {
            return userPic;
          }

        }
  
        return null;
      }
     catch (error) {
      console.log(error)
      return null;
    }
  
}

export async function saveUserWill(userWill) {

  try {

      if (isSignedIn()) {

          const storage = new Storage({ userSession });
          return await storage.putFile(uuid, userWill, imageFileOptions);

      }

      return null;
  }
  catch(err){
      console.log(error)
      return null;
  }
}


