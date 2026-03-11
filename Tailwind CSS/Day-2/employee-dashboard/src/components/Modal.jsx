import { useEffect } from "react"

function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="text-lg text-slate-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="btn-icon text-lg leading-none">X</button>
                </div>
                <div className="modal-body px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;
