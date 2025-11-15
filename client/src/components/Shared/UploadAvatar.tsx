import { notification, Spin } from "antd";
import React, { useState } from "react";

interface UploadAvatarProps {
  onFileUpload: (url: string) => void;
}

const UploadAvatar: React.FC<UploadAvatarProps> = ({ onFileUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (files: any) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("file", files[0]);
      formData.append("upload_preset", "connectMe");
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await resp.json();

      setLoading(false);
      setPreviewUrl(data?.secure_url);
      onFileUpload(data?.secure_url);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Unable to uplaod",
        placement: "topRight",
      });
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="mb-4 rounded-md p-2 cursor-pointer"
          placeholder="Add Post Image"
        />
        {loading && <Spin />}
      </div>
      {previewUrl && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Image Preview:</h3>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-[150px] object-cover rounded-lg border border-gray-200 object-cover"
          />
        </div>
      )}
    </>
  );
};

export default UploadAvatar;
