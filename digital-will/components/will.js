import { toast } from 'react-toastify';

export default function WillCard({ title, desc, img, claimed }) {

    const claimWill = async (e) => {
        toast.success('Claimed!', {
            toastId: "claimed",
        });
    }

    return (
        <div className='p-5'>
            <div className="flex flex-col items-center bg-white border rounded-lg shadow-md md:flex-row lg:max-w-[30rem] xl:max-w-[40rem] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={img} alt={title} />
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{desc}</p>
                    <button onClick={claimWill} type="button" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Claim</button>
                </div>
            </div>
        </div>
    );
}
