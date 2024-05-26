import { useState, useEffect } from "react";

export function useSearch(files, query) {
  const [filteredFiles, setFilteredFiles] = useState(files);

  useEffect(() => {
    if (!query) {
      setFilteredFiles(files);
    } else {
      setFilteredFiles(
        files.filter(file =>
          file.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [files, query]);

  return filteredFiles;
}
