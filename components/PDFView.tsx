"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
// We need to configure CORS
// gsutil cors set cors.json gs://<app-name>.appspot.com
// gsutil cors set cors.json gs://chat-with-pdf-7ed72.appspot.com
// go here >>> https://console.cloud.google.com/
// create new file in editor calls cors.json
// run >>> // gsutil cors set cors.json gs://chat-with-pdf-7ed72.appspot.com
// https://firebase.google.com/docs/storage/web/download-files#cors_configuration

// This line sets the URL for the PDF.js worker script. The worker script is essential for handling the heavy lifting of parsing PDF files, which allows the main thread to remain free for other tasks.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// What are Web Workers?: Web Workers are scripts that run in the background, separate from the main execution thread of a web page. They allow you to perform tasks without blocking the user interface.
// pdfjs.GlobalWorkerOptions.workerSrc: This property sets the path to the worker script that PDF.js will use. The worker script is responsible for parsing and rendering PDF files in the background.

function PDFView({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(url);
      const data = await response.blob();
      setFile(data);
    };

    fetchPdf();
  }, [url]);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  return (
    <div className="flex flex-col justify-center items-center">
        <div className="sticky top-0 z-50 bg-gray-100 p-2 rounded-b-lg">
        <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
          <Button
            variant="outline"
            disabled={pageNumber === 1}
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
          >
            Previous
          </Button>

          <p className="flex items-center justify-center">
            {pageNumber} of {numPages}
          </p>
          <Button
            variant="outline"
            disabled={pageNumber === numPages}
            onClick={() => {
              if (numPages) {
                if (pageNumber < numPages) {
                  setPageNumber(pageNumber + 1);
                }
              }
            }}
          >
            Next
          </Button>
          <Button
            variant="outline"
            onClick={() => setRotation((rotation + 90) % 360)}
          >
            <RotateCw />
          </Button>

          <Button
            variant="outline"
            disabled={scale >= 1.5}
            onClick={() => {
              setScale(scale * 1.2);
            }}
          >
            <ZoomInIcon />
          </Button>

          <Button
            variant="outline"
            disabled={scale <= 0.75}
            onClick={() => setScale(scale / 1.2)}
          >
            <ZoomOutIcon />
          </Button>

          </div>
          </div>
      {!file ? (
        <Loader2Icon className="w-10 h-10 animate-spin" />
      ) : (
        <Document
          loading={<Loader2Icon className="w-20 h-20 animate-spin mt-20" />}
          file={file}
          rotate={rotation}
          onLoadSuccess={onDocumentLoadSuccess}
          className={`w-full h-full flex flex-col items-center gap-4 overflow-scroll`}
        >
          <Page className="shadow-lg" pageNumber={pageNumber} scale={scale} />
        </Document>
      )}
    </div>
  );
}
export default PDFView;
