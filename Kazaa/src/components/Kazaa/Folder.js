import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { database } from "../../firebase";

export default function Folder({ folder }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this folder?");
    if (!confirmDelete) return;

    try {
      // Check for child folders
      const childFolders = await database.folders.where("parentId", "==", folder.id).get();
      if (!childFolders.empty) {
        alert("Cannot delete a folder with subfolders");
        return;
      }

      // Check for child files
      const childFiles = await database.files.where("folderId", "==", folder.id).get();
      if (!childFiles.empty) {
        alert("Cannot delete a folder with files");
        return;
      }

      // Delete the folder
      await database.folders.doc(folder.id).delete();
      alert("Folder deleted successfully!");
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder. Please check permissions and try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <Button
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        variant="outline-dark"
        className="text-truncate w-100 mr-2"
        as={Link}
      >
        <FontAwesomeIcon icon={faFolder} className="mr-2" />
        {folder.name}
      </Button>
      <button onClick={handleDelete} className="btn btn-outline-danger">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}
