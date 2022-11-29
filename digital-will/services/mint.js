import { imageValidation, resizeImage } from "./image";
import { toast } from 'react-toastify';
import { isPrincipalCV, isUintCV } from "./clarity";
import { encryptData } from "../libs/stacks/encryption/symmetric";
import { Mint } from "../libs/stacks/contracts/integration";
import { saveUserWill } from "../libs/stacks/gaiahub/storage";

export async function MintWill(state) {

    // Empty Form Validation
    if (state.beneficiary == undefined || state.will_file == undefined || state.unlock_date == undefined || state.tokens == undefined) {
        toast.error('Please fill out all the neccessary fields!', {
            toastId: "field",
        });

        return;
    }

    // Converting Date to Unix Timestamp
    const dateTimestamp = Math.floor(new Date(state.unlock_date).getTime() / 1000);

    // Invalid Type Validation
    if (!isPrincipalCV(state.beneficiary) || !isUintCV(dateTimestamp) || !isUintCV(state.tokens)) {
        toast.error('Invalid types used on fields!', {
            toastId: "type",
        });
    }

    if (imageValidation(state.will_file)) {

        try {

            const ResizedImage = await toast.promise(
                resizeImage(state.will_file, 450),
                {
                    pending: 'Compressing Your Image...',
                    success: 'Compressed 👌',
                    error: 'Error in Compressing 🤯'
                }
            )

            const cid = await toast.promise(
                saveUserWill(ResizedImage),
                {
                    pending: 'Uploading Your Image...',
                    success: 'Uploaded 👌',
                    error: 'Error in Uploading 🤯'
                }
            )
            
            toast.dismiss()

            if (cid) {

                // encrypt
                const url = await encryptData(cid);

                let will = {
                    beneficiary: state.beneficiary,
                    unlockTimestamp: dateTimestamp,
                    amount: state.tokens,
                    url: url
                }

                // Call Mint Function
                Mint(will)
            }

        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        toast.error('Invalid File Type OR Size Exceeds 2 MB!', {
            toastId: "Image",
        });
    }
}