type IconPropsType = {
    iconId: string;
    width?: string;
    height?: string;
    viewBox?: string;
}

export const Icon: React.FC<IconPropsType> = ({ iconId, width = "32", height = "32", viewBox = "0 0 32 32" }) => {
    return (
        <svg width={width} height={height} viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <use href={`#${iconId}`} />
        </svg>
    )
}
