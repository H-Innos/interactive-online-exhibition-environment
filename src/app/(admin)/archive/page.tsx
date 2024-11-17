import ArchiveClientComponent from "./ArchiveClientComponent";
import { Suspense } from "react";

const ArchivePage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Archived Exhibitions</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ArchiveClientComponent />
      </Suspense>
    </div>
  );
};

export default ArchivePage;