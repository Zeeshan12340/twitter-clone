import { useState } from 'react'
import { FileDrop } from 'react-file-drop'

export default function Upload({ children, onUploadFinish }) {
    const [file, setFile] = useState(false)
    const [isFileOver, setIsFileOver] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    function uploadImage(files, event) {
        event.preventDefault();
        setFile(false)
        setIsFileOver(false)
        setIsUploading(true)
        const data = new FormData();
        data.append('post', files[0])
        fetch('/api/upload', {
            method: 'POST',
            body: data,
        })
        .then(async response => {
            const json = await response.json()
            onUploadFinish(json.src)
            setIsUploading(false)
        })
    }

    return (
        <div className="border-4 border-red-500">
            <FileDrop 
                onDrop={uploadImage}
                onDragOver={() => {setIsFileOver(true)}}
                onDragLeave={() => {setIsFileOver(false)}}
                onFrameDragEnter={() => {setFile(true)}}
                onFrameDragLeave={() => {setFile(false)}}
                onFrameDrop={() => {
                    setFile(false)
                    setIsFileOver(false)
            }}
            >
                <div className='relative'>
                    {(file || isFileOver) && (
                        <div className='flex items-center justify-center bg-socialCyan absolute inset-0'>drop images here!</div>
                    )}
                    {children({isUploading})}
                </div>
            </FileDrop>
        </div>
    )
}