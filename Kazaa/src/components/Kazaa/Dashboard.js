import React, { useEffect, useState, useMemo } from "react";
import { Container, Table, Form, Pagination, Spinner } from "react-bootstrap"; // Removed Button from imports
import AddFileButton from "./AddFileButton";
import Navbar from "./Navbar";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";
import { useSearch } from "../../hooks/useSearch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DashboardStyle.css";

export default function Dashboard() {
  const { folderId = null } = useParams();
  // Removed the unused state variable assignment
  const { currentUser } = useAuth();
  const [allFiles, setAllFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        const filesSnapshot = await database.files.orderBy("createdAt", "desc").get();
        setAllFiles(filesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching files: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFiles();
  }, [currentUser]);

  const filteredFiles = useSearch(
    useMemo(() => allFiles.filter(file => filter === "all" || `.${file.name.split('.').pop()}` === filter), [allFiles, filter]),
    query
  );

  const getFileNameWithoutExtension = (name) => {
    return name.split('.').slice(0, -1).join('.');
  };

  const getFileType = (name) => {
    return `.${name.split('.').pop()}`;
  };

  const availableFileTypes = useMemo(() => [...new Set(allFiles.map(file => getFileType(file.name)))], [allFiles]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFiles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFiles, currentPage, itemsPerPage]);

  const handleFileUploadSuccess = async (newFile) => {
    setLoading(true); // Start the spinner
    try {
      const filesSnapshot = await database.files.orderBy("createdAt", "desc").get();
      setAllFiles(filesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error fetching files: ", error);
    } finally {
      setLoading(false); // Stop the spinner
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="kazaa-background d-flex">
        <Container fluid className="kazaa-drive-container">
          <div className="profile-section mb-4">
            <h2>Welcome to Kazaa!</h2>
            <p>Email: {currentUser.email}</p>
          </div>
          <div className="search-section mb-4 d-flex justify-content-between align-items-center">
            <Form.Group className="d-flex align-items-center" style={{ flex: 1 }}>
              <Form.Control
                type="text"
                placeholder="Search files"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mr-2"
                style={{ width: "50%" }}
              />
            </Form.Group>
            <div className="ml-auto">
              <AddFileButton currentFolder={{ id: folderId }} onFileUploadSuccess={handleFileUploadSuccess} />
            </div>
          </div>
          <div className="filter-section mt-2 d-flex">
            <Form.Check
              type="radio"
              id="filter-all"
              label="All"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
              className="mr-2"
            />
            {availableFileTypes.map(type => (
              <Form.Check
                key={type}
                type="radio"
                id={`filter-${type}`}
                label={type}
                value={type}
                checked={filter === type}
                onChange={(e) => setFilter(e.target.value)}
                className="mr-2"
              />
            ))}
          </div>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="kazaa-column">
              <h3>All Files</h3>
              {paginatedFiles.length > 0 ? (
                <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: "40%" }}>Filename</th>
                        <th style={{ width: "30%" }}>Uploaded at</th>
                        <th style={{ width: "20%" }}>File Type</th>
                        <th style={{ width: "10%" }}>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFiles.map((file) => (
                        <tr key={file.id}>
                          <td className="text-truncate" style={{ maxWidth: "200px" }}>{getFileNameWithoutExtension(file.name)}</td>
                          <td>{file.createdAt?.seconds ? new Date(file.createdAt.seconds * 1000).toLocaleString() : "N/A"}</td>
                          <td>{getFileType(file.name)}</td>
                          <td>
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p>No files found.</p>
              )}
            </div>
          )}
          <div className="pagination-section mt-3">
            <Pagination>
              {Array.from({ length: Math.ceil(filteredFiles.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Container>
      </div>
    </>
  );
}
