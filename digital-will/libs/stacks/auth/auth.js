// authentication of user
import { showConnect } from "@stacks/connect";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { pubKeyfromPrivKey, publicKeyToString } from '@stacks/transactions';
import { AppConfig, UserSession } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export var userSession = new UserSession({ appConfig });

// Set this to true if you want to use Mainnet
const boolNetworkType = false;

export function getPublicKey() {
  try {
    return publicKeyToString(pubKeyfromPrivKey(getUserData().appPrivateKey));
  }
  catch (err) {
    console.log(err)
    return null;
  }
}

export function networkType() {
  if (boolNetworkType) return new StacksMainnet();
  else return new StacksTestnet();
}

// this will return the users stx address if logged in
export function myStxAddress() {
  try {
    if (getUserData()) {
      if (boolNetworkType) return getUserData().profile.stxAddress.mainnet;
      else return getUserData().profile.stxAddress.testnet;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

// bind this function on signin button OnClick
export function Signin() {
  try {
    console.log(window.location.origin + "logo.svg");
    showConnect({
      appDetails: {
        name: "Digital Will",
        icon: "https://www.svgrepo.com/show/217623/contract.svg",
      },
      onFinish: () => {
        window.location.reload();
      },
      userSession: userSession,
    });
  } catch (err) {
    console.log(err);
    return;
  }
}

export function getUserData() {
  try {
    if (userSession) {
      if (userSession.isUserSignedIn()) {
        return userSession.loadUserData();
      } else {
        console.log("User is not Signed in");
      }
    }
  } catch (err) {
    console.log(err);
    return;
  }
}

export function isSignedIn() {
  try {
    if (userSession) {
      if (userSession.isUserSignedIn()) {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// bind this function on signout button OnClick
export function Signout() {
  try {
    if (userSession !== null) {
      if (userSession.isUserSignedIn()) {
        userSession.signUserOut();
        window.location.reload();
      }
    } else {
      console.log("User is not Signed in");
    }

  } catch (err) {
    console.log(err);
    return;
  }
}
