import { useState } from "react";
import { toast } from 'react-toastify';

export default function ProfileCard ({address, tokens}) {
   
    const [profilePic, setProfilePic] = useState({
        // Initially, no file is selected
        selectedFile: null
      });

    const onFileChange = (event) => {

        // Update the state
        setProfilePic({ selectedFile:  URL.createObjectURL(event.target.files[0]) });
      };

      const requestTokens = (e) => {
      
         if (address)
         {
             fetch('https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx', {
               method: 'POST', // or 'PUT'
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 address: address,
                 stacking: false
                 }),
             }).then((response) => response.json())
             .then((data) => {
               toast.success('Request Recieved!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });
             })
             .catch((error) => {
               toast.error('Error in Request!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });
             });
         }
       }

       return (
         <div className="flex-wrap w-full bg-[#4F8EB5] rounded-md p-5">
         <div className="flex flex-wrap justify-center text-center">

                {/* Avatar */}

                <input id="imgupload" className="hidden" type="file" onChange={onFileChange}></input>
                <label className="cursor-pointer" htmlFor="imgupload">
                    <img className="rounded-[40px] w-[70px] h-[70px] cursor-pointer ml-[20px] mr-[20px]"
                    src={profilePic.selectedFile? profilePic.selectedFile : "https://raw.githubusercontent.com/JustMonk/codepen-resource-project/master/img/pixel%20avatar.png"} alt="user avatar" />
                    </label>
               

               {/* Name */}
               
               <div className="flex flex-col">
               <h1 className="text-white text-[50px]">Ummar Ikram</h1>
                    <h2 className="text-blue text-[25px]">{address? address.slice(0,4) + "...." + address.slice(address.length-4): ""}</h2>
               </div>
                    
            </div>
             

             {/* Stats */}
             <div className="flex flex-wrap mt-10 p-5 text-center text-[#6e6e6e] bg-white m-5 justify-around rounded-md">
                <div className="p-4">
                   <h1 className="text-3xl">Coins</h1>
                   <h2 className="text-2xl">10</h2>
                </div>
                <div className="p-4">
                   <h1 className="text-3xl">Tokens</h1>
                   <h2 className="text-2xl">{tokens? tokens: "..."}</h2>
                 </div>
                
                   <div className="p-4">
                   <h1 className="text-3xl">Wills</h1>
                   <h2 className="text-2xl">10</h2>
                 </div>
             </div>

             {/* Request Tokens */}
            
             <button onClick={requestTokens} className="w-full mt-4 py-2 px-4 text-base font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">
                Request Tokens       
             </button>

          </div>
       );
}
