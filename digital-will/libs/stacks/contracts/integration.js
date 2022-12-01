import { myStxAddress } from "../auth/auth";
import {
    standardPrincipalCV,
    bufferCV,
    uintCV,
    FungibleConditionCode,
    NonFungibleConditionCode,
    createAssetInfo,
    makeContractSTXPostCondition,
    makeStandardSTXPostCondition,
    makeStandardNonFungiblePostCondition
} from "@stacks/transactions";

import { appCallPublicFunction, appCallReadOnlyFunction } from "./interface";
import { DevelopmentMode } from "../auth/auth";

export const contractDeployerAddress = DevelopmentMode? "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM":"STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K";
export const contractName = DevelopmentMode? "will-prod" : "digital-wills-V5";
export const assetName = 'digital-will';

export async function getTokenId() {
    try {
        const value = await appCallReadOnlyFunction({
            contractAddress: contractDeployerAddress,
            contractName: contractName,
            functionName: "get-last-token-id",
            functionArgs: [
            ],
        });
       
        return parseInt(value.value.value);
    }
    catch (error) {
        console.log(error);
        return;
    }

}

export async function Mint(will) {

    // Fungible Token Post Conditions
    const STXpostConditionCode = FungibleConditionCode.GreaterEqual;
    const STXpostConditionAmount = will.amount;

    // Non-Fungible Token Post Conditions
    const NFTpostConditionAddress = will.beneficiary;
    const NFTpostConditionCode = NonFungibleConditionCode.Owns;
    const prevTokenId = await getTokenId();
    const tokenAssetName = uintCV(prevTokenId+1);
    const nonFungibleAssetInfo = createAssetInfo(contractDeployerAddress, contractName, assetName);

    const postConditions = [
        makeStandardSTXPostCondition(
            myStxAddress(),
            STXpostConditionCode,
            STXpostConditionAmount
        ),
        makeStandardNonFungiblePostCondition(
            NFTpostConditionAddress,
            NFTpostConditionCode,
            nonFungibleAssetInfo,
            tokenAssetName
        ),
    ]

    const functionArgs = [
        standardPrincipalCV(will.beneficiary),
        uintCV(will.unlockTimestamp),
        uintCV(will.amount),
        bufferCV(will.url),
    ];

    const options = {
        contractAddress: contractDeployerAddress,
        contractName: contractName,
        functionName: "mint",
        functionArgs,
        postConditions,
    };

    appCallPublicFunction(options);
}

export async function Claim(id, amount) {

    // Fungible Token Post Conditions
    const STXpostConditionCode = FungibleConditionCode.GreaterEqual;
    const STXpostConditionAmount = amount;

    const postConditions = [
        makeContractSTXPostCondition(
            myStxAddress(),
            contractName,
            STXpostConditionCode,
            STXpostConditionAmount
        ),
    ]

    const functionArgs = [
        uintCV(id)
    ];

    const options = {
        contractAddress: contractDeployerAddress,
        contractName: contractName,
        functionName: "claim",
        functionArgs,
        postConditions,
    };

    appCallPublicFunction(options);
}

export async function getWillData(id){
    try {
        const value = await appCallReadOnlyFunction({
          contractAddress: contractDeployerAddress,
          contractName: contractName,
          functionName: "get-will-data",
          functionArgs: [
            uintCV(id)
          ],
        });
       
        return value.value.value;
      }
      catch(error){
        console.log(error);
        return;
      }
}

