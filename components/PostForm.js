import { useState } from 'react';
import Avatar from './Avatar';
import Upload from './Upload';
import Image from 'next/image';

export default function PostForm({userInfo, onPost, compact, parent, onChange}) {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);

    async function handleTweet(e) {
        e.preventDefault();
        await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text, parent, images}),
        });
        setText('');
        setImages([]);
        
        if (onPost) {
            onPost();
        }
    }

    return (
        <form className="mx-5" onSubmit={handleTweet}>
        <div className={( compact? 'items-center ':'') + "flex"}>
          <Avatar src={userInfo?.image} big classNames={'mt-1'} onChange={onChange} />
          <div className="flex-grow pl-4">
            <Upload onUploadFinish={src => setImages(prev => [...prev, src])}>
                {({isUploading}) => (
                    <div>
                      {isUploading && (
                        <div className='flex'>Uploading...</div>
                      )}
                      <textarea className={(compact? 'h-10': 'h-24') + " w-full p-2 bg-transparent text-socialWhite"}
                        placeholder={(compact? "Tweet your reply":"What's happening?")}
                        value={text} onChange={e => setText(e.target.value)} id='post'></textarea>
                      <div className='flex -mx-2'>
                        {images.length > 0 && images.map(image => (
                          <div key={image} className='h-24 m-2'>
                            <Image width={300} height={300} className='h-24 w-auto' src={image} alt='' />
                          </div>
                        ))}
                      </div>
                  </div>
                )}
            </Upload>
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