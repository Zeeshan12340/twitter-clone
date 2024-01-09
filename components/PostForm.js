import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Avatar from './Avatar';

export default function PostForm({userInfo, onPost}) {
    const [text, setText] = useState('');
    const router = useRouter();

    async function handleTweet(e) {
        e.preventDefault();
        await axios.post('/api/posts', {text});
        setText('');
        
        if (onPost) {
            onPost();
        }
    }

    return (
        <form className="mx-5" onSubmit={handleTweet}>
        <div className="flex">
          <Avatar src={userInfo?.image} />
          <div className="flex-grow pl-4">
            <textarea className="w-full p-2 bg-transparent text-socialWhite" placeholder={"What's happening?"}
                value={text} onChange={e => setText(e.target.value)}></textarea>
            <div className="text-right border-t border-socialBorder pt-2 pb-2">
              <button className="bg-socialCyan text-white rounded-full px-4 py-2">Tweet</button>
            </div>
          </div>
        </div>
      </form>
    )
}