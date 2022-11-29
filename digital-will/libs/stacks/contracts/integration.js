import { networkType, myStxAddress } from "../auth/auth";
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

import { appCallReadOnlyFunction } from "./interface";

import { openContractCall } from "@stacks/connect";

export const contractDeployerAddress = "STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K";
export const contractName = "digital-wills-V4";
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
    console.log(prevTokenId);
    const tokenAssetName = uintCV(prevTokenId+1);
    const nonFungibleAssetInfo = createAssetInfo(contractDeployerAddress, contractName, assetName);

    // const standardNonFungiblePostCondition = 
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
        network: networkType(),
        appDetails: {
            name: "Digital Will",
            icon: "https://www.svgrepo.com/show/217623/contract.svg",
        },
        onFinish: (data) => {
            console.log("Stacks Transaction:", data.stacksTransaction);
            console.log("Transaction ID:", data.txId);
            console.log("Raw transaction:", data.txRaw);
        },
    };

    openContractCall(options);
}

