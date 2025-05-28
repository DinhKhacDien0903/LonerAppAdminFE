export const formatMessageTime = (timeString) => {
    const createdAt = new Date(timeString);
    const now = new Date();

    const isToday =
        createdAt.getDate() === now.getDate() &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear();

    if (isToday) {
        return createdAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } else {
        // Tự format ngày thành DD-MM-YYYY
        const day = String(createdAt.getDate()).padStart(2, '0');
        const month = String(createdAt.getMonth() + 1).padStart(2, '0');
        const year = createdAt.getFullYear();
        return `${day}-${month}-${year}`;
    }
};
