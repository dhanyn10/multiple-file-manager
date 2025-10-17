import { MissingSequence } from '../utils/fileUtils';

interface FormattedMissingSequence extends MissingSequence {
  start: string;
  end: string;
  missingCount: number;
}

interface MissingFilesReportProps {
  report: FormattedMissingSequence[] | null;
}

const MissingFilesReport = ({ report }: MissingFilesReportProps) => {
  if (!report) return null;

  return (
    <table className="w-full text-sm text-left text-slate-500 table-fixed">
      <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
        <tr>
          <th scope="col" className="px-4 py-2">Description</th>
          <th scope="col" className="px-4 py-2">Range</th>
        </tr>
      </thead>
      <tbody>
        {report.length > 0 ? (
          report.map((seq, index) => (
            <tr key={index} className="bg-white border-b border-slate-200/60">
              <td className="px-4 py-2 font-medium text-slate-900 break-all">Missing {seq.missingCount} file(s)</td>
              <td className="px-4 py-2 break-all text-red-500">Between {seq.start} and {seq.end}</td>
            </tr>
          ))
        ) : (
          <tr className="bg-white border-b border-slate-200/60"><td colSpan={2} className="px-4 py-2 text-center text-green-600 font-semibold">No missing files detected in sequence.</td></tr>
        )}
      </tbody>
    </table>
  );
};

export default MissingFilesReport;