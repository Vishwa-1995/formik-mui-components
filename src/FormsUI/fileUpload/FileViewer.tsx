import {
  AppBar,
  Box,
  DialogContent,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { create } from "zustand";
import CancelIcon from "@mui/icons-material/Cancel";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Link } from "react-router-dom";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useEffect, useState } from "react";

type FileViewerStore = {
  file: any;
  zoom: number;
  close: boolean;
};

const useFileViewerStore = create<FileViewerStore>((set) => ({
  file: {},
  zoom: 1,
  close: false,
}));

export const openFileViewer = (file: any) => {
  useFileViewerStore.setState({
    file: file,
    zoom: 1,
    close: true,
  });
};

export const closeFileViewer = () => {
  useFileViewerStore.setState({
    close: false,
  });
};

function FileViewer() {
  const { file, zoom, close } = useFileViewerStore();

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => URL.revokeObjectURL(url); // Cleanup URL on unmount
    }
  }, [file]);

  if (!fileUrl) {
    return <p>Loading File...</p>;
  }

  return (
    <Dialog
      fullScreen
      open={close}
      onClose={closeFileViewer}
      fullWidth={true}
      slotProps={{
        paper: {
          style: { borderRadius: 15 },
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={closeFileViewer}>
            <CancelIcon />
          </IconButton>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ width: "100%" }}
          >
            {(typeof file == "object" && file?.type !== "application/pdf") ||
            (typeof file == "string" && file?.split(".")?.pop() !== "pdf") ? (
              <>
                <IconButton color="inherit">
                  <Link to={fileUrl} target="_blank" style={{ color: "white" }}>
                    <FullscreenIcon />
                  </Link>
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (zoom < 2.0)
                      useFileViewerStore.setState({
                        ...useFileViewerStore,
                        zoom: zoom + 0.2,
                      });
                  }}
                >
                  <ZoomInIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (zoom > 1.0)
                      useFileViewerStore.setState({
                        ...useFileViewerStore,
                        zoom: zoom - 0.2,
                      });
                  }}
                >
                  <ZoomOutIcon />
                </IconButton>
              </>
            ) : null}
          </Stack>
        </Toolbar>
      </AppBar>
      <DialogContent style={{ display: "flex", justifyContent: "center" }}>
        {(typeof file == "object" && file?.type === "application/pdf") ||
        (typeof file == "string" &&
          file &&
          file?.split(".")?.pop() === "pdf") ? (
          <Box style={{ height: "100vh", width: "100%" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={fileUrl} />
            </Worker>
          </Box>
        ) : (
          <img
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              transformOrigin: "top left",
              transform: `scale(${zoom})`,
            }}
            src={fileUrl}
            alt=""
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FileViewer;
