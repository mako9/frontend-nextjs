import styles from '../styles/gallery.module.css'

export default function Gallery({ title, items, images, onClick }) {
    return (
        <div>
            <h1>{title}</h1>
            <div className={styles.gallery}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={styles.gallery_item}
                        onClick={() => onClick(item.uuid)}
                    >
                        <img
                            src={
                                images.find((e) => e.uuid === item.uuid)
                                    ?.imageUrl
                            }
                            alt={item.name}
                            width={300}
                            height={200}
                        />
                        <text className={styles.gallery_title}>
                            {item.name}
                        </text>
                    </div>
                ))}
            </div>
        </div>
    )
}
