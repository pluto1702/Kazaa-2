import { faFile, faTrash, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { storage, database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function File({ file }) {
  const { currentUser } = useAuth();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${file.name}?`);
    if (!confirmDelete) return;

    try {
      // Delete file from storage
      const fileRef = storage.ref(`/files/${currentUser.uid}/${file.name}`);
      await fileRef.delete();

      // Delete file record from Firestore
      await database.files.doc(file.id).delete();
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file: ", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      await database.files.doc(file.id).update({ shared: true });
      alert("File shared successfully!");
    } catch (error) {
      console.error("Error sharing file: ", error);
      alert("Failed to share file. Please try again.");
    }
  };

  return (
    <div className="file-item">
      <a
        href={file.url}
        target="_blank"
        className="btn btn-outline-dark text-truncate w-100"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faFile} className="mr-2" />
        {file.name}
      </a>
      {!file.shared && (
        <>
          <button className="btn btn-outline-primary btn-sm" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      )}
    </div>
  );
}
