import React from "react";
import { cleanTimetable } from "../utils";

interface TimetableDetailsProps {}

const TimetableDetails: React.FC<TimetableDetailsProps> = () => {
  return (
    <details className="p-4 [&_svg]:open:-rotate-180">
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
        <div>Thời khóa biểu</div>
      </summary>
      <iframe
        id="myframe"
        src="https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx"
        className="w-full h-[400px] border"
        onLoad={() => {
          const iframe = document.getElementById(
            "myframe"
          ) as HTMLIFrameElement;
          if (iframe) {
            const iframeDocument = iframe.contentWindow?.document;
            cleanTimetable(iframeDocument);
          }
        }}
      ></iframe>
    </details>
  );
};

export default TimetableDetails;
