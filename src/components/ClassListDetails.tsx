import React from "react";

interface ClassListDetailsProps {
  handleDownload: () => void;
}

const ClassListDetails: React.FC<ClassListDetailsProps> = ({
  handleDownload,
}) => {
  return (
    <details className="p-4 [&_svg]:open:-rotate-180 mt-4">
      <summary className="flex cursor-pointer list-none items-center gap-4 text-xl">
        <div>
          <svg
            className="rotate-0 transform text-blue-700 transition-all duration-300"
            fill="none"
            height={20}
            width={20}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div className="flex gap-4 items-center">
          Danh sách lớp hiện tại (
          {
            document.querySelector("#ctl00_mainContent_lblOldGroup")
              ?.textContent
          }
          )
          <div
            onClick={handleDownload}
            className="hover:bg-green-700 font-bold py-2 px-4 bg-green-500 text-white rounded-md"
          >
            Tải danh sách lớp
          </div>
        </div>
      </summary>
      <div className="h-[500px] overflow-y-scroll" id="class-list"></div>
    </details>
  );
};

export default ClassListDetails;
