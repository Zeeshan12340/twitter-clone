import {getProviders, signIn, useSession} from 'next-auth/react'
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Login({providers}) {
    const {data, status} = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>Loading...</div>
    }
    if (data || status === 'authenticated') {
        router.push('/')
        return <div>Redirecting...</div>
    }
    return (
        <div className="flex items-center justify-center h-screen">
            {Object.values(providers).map(provider => (
                <div key={provider.id}>
                    <button onClick={() => {signIn(provider.id)}} className='flex bg-socialCyan pl-4 pr-3 py-2 text-black rounded-full items-center'>
                        <Image src={`/${provider.name}.png`} alt='' width={25} height={25} />&nbsp;
                        Sign in with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: { providers },
    };
}