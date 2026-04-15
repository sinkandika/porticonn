import { useState } from "react"
import { uploadImageToCloudinary } from "../../services/cloudinaryService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const EditPhotoModal = ({ user, onclose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // change pic
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // upload and update pic
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // upload to cloudinary
      const imageUrl = await uploadImageToCloudinary(file);

      // save to firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: imageUrl,
      });

      onSuccess(imageUrl); // update ui
      onclose();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-white p-5 rounded-md w-80 min-h-50 flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <p className="text-lg font-medium">
              Change Photo Profile
            </p>
            <div className="border-b-2 border-background"></div>
          </div>

          <div className="w-full flex flex-col items-center gap-y-4">
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-25 h-25 rounded-full mt-2 object-cover"
              />
            )}
          <input
            type="file"
            id="fileUpload"
            onChange={handleChange}
            className="hidden"
          />

          <label
            htmlFor="fileUpload"
            className="bg-primary hover:bg-primary-h text-white px-4 py-2 rounded-md cursor-pointer text-xs"
          >
            {file ? "Change Photo" : "Choose Photo"}
          </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button 
            onClick={onclose} 
            className="bg-cancel hover:bg-cancel-h rounded-md px-3 py-2 text-white">
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`
            text-white rounded-md py-2 px-3
              ${loading
                ? 'bg-disable-button cursor-not-allowed opacity-50'
                : 'bg-third hover:bg-third-h'
              }
            `}
            >
              {loading 
              ? "Uploading..." 
              : "Save"
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

export default EditPhotoModal;