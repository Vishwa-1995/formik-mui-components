import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  // useTheme
} from "@mui/material";
import PropTypes from "prop-types";
import DownloadIcon from "@mui/icons-material/Download";
// import XLSX from 'sheetjs-style'
// import { useEffect } from "react";

// interface ExportExcelProps {
//   exportData: any[];
// }

ExportExcel.propTypes = {
  exportData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getDownload: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};

function ExportExcel({ exportData, isLoading, getDownload, isEmpty }: any) {
  //  const exportToExcel = async (data : any[]) => {
  //       const fileExtension = '.xlsx';
  //       const ws = XLSX.utils.json_to_sheet(data);
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //     XLSX.writeFile(wb, 'Number List' + fileExtension);
  //   }

  return (
    <Box>
      <Tooltip title="Export Excel">
        <span>
          <Button
            onClick={getDownload}
            color="primary"
            type="button"
            variant="contained"
            sx={{ margin: 1 }}
            disabled={isLoading || isEmpty}
          >
            {isLoading ? <CircularProgress size={"25px"} /> : <DownloadIcon />}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
}

export default ExportExcel;
