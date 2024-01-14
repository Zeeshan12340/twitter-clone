import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UseUserInfo from '../hooks/UseUserInfo';

export default function UsernameForm() {
    const {userInfo, status} = UseUserInfo();
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;
        if (username === '') {
            const defaultUsername = "default";
            setUsername(defaultUsername.replace(/[^a-z]+/gi, ''));
        } else {
            setUsername(username.replace(/[^a-z]+/gi, ''));
        }
    }, [status, username])

    async function handleSubmit(e) {
        e.preventDefault();
        await fetch('/api/users', {
            method: 'PUT',
            body: JSON.stringify({username}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        router.reload();
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <form className="text-center text-xl" onSubmit={handleSubmit}>
                <h1 className="py-1">Pick a username</h1>
                <input type="text" className="block mb-1 bg-socialLightGrey px-3 py-1 rounded-full text-center" placeholder={'username'} value={username} onChange={e => setUsername(e.target.value)} />
                <button className="block bg-socialCyan w-full rounded-full py-1">Continue</button>
            </form>
        </div>
    )
}