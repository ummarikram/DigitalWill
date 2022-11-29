import {
    standardPrincipalCV,
    stringAsciiCV,
    bufferCV,
    responseErrorCV,
    responseOkCV,
    trueCV,
    falseCV,
    uintCV,
    intCV,
    deserializeCV
  } from "@stacks/transactions";

  export function isPrincipalCV(address){
    try {
        standardPrincipalCV(address);
        return true;
    }
    catch(err){
        return false;
    }
  }

  export function isUintCV(num){
    try {
        uintCV(num);
        return true;
    }
    catch(err){
        return false;
    }
  }

  export function isBufferCV(buffer){
    try {
        bufferCV(buffer);
        return true;
    }
    catch(err){
        return false;
    }
  }

  export function isStringCV(text){
    try {
        stringAsciiCV(text);
        return true;
    }
    catch(err){
        return false;
    }
  }