export const cloudinaryConfigTest = {
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
    secure: true
}

export const uploadImage = async (file: File) => { // function to upload image to cloudinary 
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'a2s8ewyw'); // replace with your upload preset
    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfigTest.cloud_name}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        const { url, public_id } = result;
        return { url, public_id }; // return the image URL
    } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        alert("Lỗi xảy ra khi upload ảnh lên cloud, vui lòng thử lại!");
        return { url: '', asset_id: '' };
    }
}


