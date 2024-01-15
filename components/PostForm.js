import { useState } from 'react';
import axios from 'axios';
import Avatar from './Avatar';

export default function PostForm({userInfo, onPost, compact, parent, onChange}) {
    const [text, setText] = useState('');

    async function handleTweet(e) {
        e.preventDefault();
        await axios.post('/api/posts', {text, parent});
        setText('');
        
        if (onPost) {
            onPost();
        }
    }

    return (
        <form className="mx-5" onSubmit={handleTweet}>
        <div className={( compact? 'items-center ':'') + "flex"}>
          <Avatar src={userInfo?.image} big classNames={'mt-1'} onChange={onChange} />
          <div className="flex-grow pl-4">
            <textarea className={(compact? 'h-10': 'h-24') + " w-full p-2 bg-transparent text-socialWhite"}
            placeholder={(compact? "Tweet your reply":"What's happening?")}
                value={text} onChange={e => setText(e.target.value)}></textarea>
            {!compact && (
              <div className="text-right border-t border-socialBorder pt-2 pb-2">
                <button className="bg-socialCyan text-white rounded-full px-4 py-2">Tweet</button>
              </div>
            )}
          </div>
        {compact && (
          <div className='pl-2'>
            <button className="bg-socialCyan text-white rounded-full px-4 py-2">Reply</button>
          </div>
        )}
        </div>
      </form>
    )
}