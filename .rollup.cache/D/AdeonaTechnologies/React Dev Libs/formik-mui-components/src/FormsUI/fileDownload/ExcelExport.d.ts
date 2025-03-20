import PropTypes from "prop-types";
declare function ExportExcel({ exportData, isLoading, getDownload, isEmpty }: any): import("react/jsx-runtime").JSX.Element;
declare namespace ExportExcel {
    var propTypes: {
        exportData: PropTypes.Validator<any[]>;
        isLoading: PropTypes.Validator<boolean>;
        getDownload: PropTypes.Validator<(...args: any[]) => any>;
        isEmpty: PropTypes.Validator<boolean>;
    };
}
export default ExportExcel;
