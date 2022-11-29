import {
    callReadOnlyFunction,
    cvToJSON,
} from "@stacks/transactions";

import { openContractCall } from "@stacks/connect";
import { networkType, myStxAddress } from "../auth/auth";

export async function appCallReadOnlyFunction(optionsProps) {
    if (!optionsProps)
        return new Promise((resolve, reject) => reject("No arguments provided"));

    const options = {
        ...optionsProps,
        network: networkType(),
        senderAddress: myStxAddress(),
    };

    return callReadOnlyFunction(options)
        .then((response) => {
            const responseJson = cvToJSON(response);

            return new Promise((resolve, reject) => resolve(responseJson));
        })
        .catch((e) => {
            return new Promise((resolve, reject) => reject(e));
        });
}

export async function appCallPublicFunction(optionsProps) {

    if (!optionsProps)
        return new Promise((resolve, reject) => reject("no arguments provided"));

    const options = {
        ...optionsProps,
        network: networkType(),
        appDetails: {
            name: "Digital Wills",
            icon: "https://www.svgrepo.com/show/217623/contract.svg",
        },
        senderAddress: myStxAddress(),
    };

    openContractCall(options);
};