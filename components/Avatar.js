import Image from 'next/image'

export default function Avatar({ src, classNames }) {
    return (
        <div className={"rounded-full overflow-hidden w-12 h-12 mb-2 " + classNames}>
            <Image src={src} width={100} height={75} alt="avatar" />
        </div>
    )
}