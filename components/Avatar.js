import EditableImage from "./EditableImage"

export default function Avatar({ src, classNames, big, onChange, type, editable=false }) {
    const width = big ? 'w-20' : 'w-12 h-12'

    return (
        <div className="rounded-full overflow-hidden">
            <EditableImage src={src} type={type}
            onChange={onChange} editable={editable}
            className={classNames + " rounded-full overflow-hidden mb-2 " + width} />
        </div>
    )
}