import { userSession, isSignedIn } from '../auth/auth';
import { Storage } from '@stacks/storage';
import { v4 as uuidv4 } from 'uuid';

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
  catch (err) {
    console.log(error)
    return null;
  }
}


export async function fetchUserPic() {

  try {

    if (isSignedIn()) {

      const storage = new Storage({ userSession });

      const userPic = await storage.getFile(USER_PROFILE_PIC, { decrypt: false });

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
      return await storage.putFile(uuidv4()+".jpg", userWill, imageFileOptions);

    }

    return null;
  }
  catch (err) {
    console.log(error)
    return null;
  }
}

