import React from "react";

interface HeaderProps {
  isLoading: { moving: boolean; fetching: boolean };
  refresh: () => void;
  handleStudentCount: () => void;
  isRegisterCourse?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isLoading,
  refresh,
  // @ts-ignore
  handleStudentCount,
  // @ts-ignore
  isRegisterCourse,
}) => {
  return (
    <div className="flex gap-6 items-center text-xl">
      <div className="flex gap-5 items-center">
        {!isLoading.fetching && (
          <>
            <a
              href="https://docs.google.com/spreadsheets/d/1CTlmTC4RgW4zk-A9VTkz4BGzjY2PMk5s/edit"
              className="group hover:bg-green-600 font-bold px-4 py-2 text-white rounded-md bg-green-500 cursor-pointer gap-8 !no-underline hover:!text-white"
              target="_blank"
            >
              Xem review GV
            </a>
            <span
              onClick={refresh}
              className="font-bold px-4 py-2 text-white rounded-md bg-green-500 cursor-pointer flex gap-8 hover:bg-green-600"
            >
              Làm mới
            </span>
            {!isRegisterCourse && (
              <div
                onClick={handleStudentCount}
                className="group hover:bg-green-600 font-bold px-4 py-2 text-white rounded-md bg-green-500 cursor-pointer gap-8"
                id="studentCount"
                title="(Có thể sẽ hơi lag)"
              >
                <span className="">Lấy sĩ số</span>
              </div>
            )}
            <span className="font-bold text-3xl" id="class-id">
              {document
                .getElementById("ctl00_mainContent_lblSubject")
                ?.textContent?.split("-")[0]
                .trim()}
            </span>
          </>
        )}

        {(isLoading.moving || isLoading.fetching) && (
          <>
            <div className="">
              {isLoading.moving
                ? "Đang thực hiện chuyển đổi, vui lòng đợi trong giây lát"
                : "Đang lấy sĩ số lớp"}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-rotate-cw rotate"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
