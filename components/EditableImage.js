import { FileDrop } from "react-file-drop";
import { useState } from "react";
import Image from "next/image";

export default function editableImage({type, src, onChange, className, editable=false}) {
    const [file, setFile] = useState(false)
    const [isFileOver, setIsFileOver] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    let extraClass = ''
    if (file) extraClass = ' bg-red-500 opacity-40 '
    if (isFileOver) extraClass = ' bg-socialCyan opacity-90 '
    if (!editable) extraClass = ''

    function updateImage(files, event) {
        if (!editable) return;
        event.preventDefault();
        setFile(false)
        setIsFileOver(false)
        setIsUploading(true)
        const data = new FormData();
        data.append(type, files[0])
        fetch('/api/upload', {
            method: 'POST',
            body: data,
        })
        .then(async response => {
            const json = await response.json()
            onChange(json.src)
            setIsUploading(false)
        })
    }

    return (
        <FileDrop 
            onDrop={updateImage}
            onDragOver={() => {setIsFileOver(true)}}
            onDragLeave={() => {setIsFileOver(false)}}
            onFrameDragEnter={() => {setFile(true)}}
            onFrameDragLeave={() => {setFile(false)}}
            onFrameDrop={() => {
                setFile(false)
                setIsFileOver(false)
            }}
        >
            <div className="text-white relative">
                <div className={"absolute inset-0 opacity-70 " + extraClass}></div>
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center" 
                            style={{backgroundColor:'rgba(48, 148, 216, 0.9)'}} >uploading...</div>
                    )}
                    {src && (
                        <div className={"flex items-center overflow-hidden " + className}>
                            <Image src={src} width={70} height={70} className={type == "image"?"rounded-full border-4 border-black":"" + " w-full h-full"} alt="cover" />
                        </div>
                    )}
            </div>
        </FileDrop>
    )
}