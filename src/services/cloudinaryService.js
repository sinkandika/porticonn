// cloudinary upload image
export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "porticonn");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dn4ptq6kb/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    return data.secure_url; // image URL
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};