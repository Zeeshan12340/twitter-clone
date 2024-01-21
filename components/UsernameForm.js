import { useState } from 'react';
import { useRouter } from 'next/router';

export default function UsernameForm() {
    const [username, setUsername] = useState('default');
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const response =  await fetch('/api/users', {
            method: 'PUT',
            body: JSON.stringify({username}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        router.reload();
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <form className="text-center text-xl" onSubmit={handleSubmit}>
                <h1 className="py-1">Pick a username</h1>
                <input type="text" className="block mb-1 bg-socialLightGrey px-3 py-1 rounded-full text-center text-black"
                    placeholder={'username'} value={username}
                    onChange={e => setUsername(e.target.value)} />
                <button className="block bg-socialCyan w-full rounded-full py-1">Continue</button>
            </form>
        </div>
    )
}