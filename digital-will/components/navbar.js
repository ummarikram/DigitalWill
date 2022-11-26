import { useEffect, useState } from "react";
import Link from "next/link";
import { Signin, isSignedIn, Signout } from "../libs/stacks/auth/auth";
const route = ['Home', 'Wills', 'Profile'];
const path = ['/', 'wills', 'profile'];

export default function Navbar({ Address }) {

    const [isConnected, setConnected] = useState(false);

    useEffect(() => {
        setConnected(isSignedIn());
    }, [isSignedIn()])

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
                    <a href="/" className="flex items-center">
                        <img src="./logo.svg" className="h-6 mr-3 sm:h-9" alt="Digital Will Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Digital Wills</span>
                    </a>
                    {!isConnected &&
                        <div className="flex items-center">
                            <button onClick={Signin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Connect Wallet
                            </button>
                        </div>
                    }

                    {isConnected &&
                        <div className="flex items-center">
                            <button onClick={Signout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Disconnect Wallet
                            </button>
                        </div>
                    }
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700">
                <div className="max-w-screen-xl px-4 py-3 mx-auto md:px-6">
                    <div className="flex justify-around">
                        <ul className="justify-space-around flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">

                            {route.map((item, index) => (
                                <li key={item}>
                                    <Link className="text-gray-900 dark:text-white hover:underline" href={`${path[index]}`}>{item}</Link>
                                    <div />
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}