// ConfirmToast.tsx
import React from 'react'
import { toast } from 'react-toastify'

interface ConfirmToastProps {
    message: string
    onConfirm: () => void
    onCancel?: () => void
}

const ConfirmToast: React.FC<ConfirmToastProps> = ({
    message,
    onConfirm,
    onCancel,
}) => {
    const handleConfirm = () => {
        onConfirm()
        toast.dismiss()
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
        toast.dismiss()
    }

    return (
        <div>
            <p>{message}</p>
            <div className="flex justify-center gap-8">
                <button onClick={handleCancel}>
                    Hủy bỏ
                </button>
                <button onClick={handleConfirm}>Đồng ý</button>
            </div>
        </div>
    )
}

export default ConfirmToast
