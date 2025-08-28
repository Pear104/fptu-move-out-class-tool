import React from "react";

interface FilterSectionProps {
  filter: any;
  setFilter: (value: any) => void;
  studentCount: any;
  lecturerList: any;
  moveList: any;
  subject: string;
  changeSubjectForm: any;
  setIsLoading: (value: any) => void;
  send: (value: any, form: any) => void;
  isRegisterCourse?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  setFilter,
  studentCount,
  lecturerList,
  moveList,
  subject,
  changeSubjectForm,
  setIsLoading,
  send,
  // @ts-ignore
  isRegisterCourse,
}) => {
  return (
    <div className="flex gap-6 items-center justify-between mb-3 mt-4">
      <div className="flex items-center text-[14px]">
        {/* {isRegisterCourse && ( */}
        <select
          name=""
          id=""
          defaultValue={""}
          className="border-2 rounded-md p-2 mt-2"
          onChange={async (e) => {
            setIsLoading((prev: any) => ({
              ...prev,
              moving: true,
            }));
            if (e.target.value) {
              send(e.target.value, changeSubjectForm);
            }
          }}
        >
          <option value="" disabled>
            Tìm theo môn học
          </option>
          {moveList?.map((move: any) => (
            <option
              key={move.moveId}
              selected={subject.includes(move.subject)}
              value={move?.moveId.replaceAll("_", "$")}
            >{`${move?.subject} (${move?.classId} - ${
              move?.lecturer.trim() == "" ? "N/A" : move?.lecturer
            })`}</option>
          ))}
        </select>
        {/* )} */}
        <select
          name=""
          id=""
          value={filter.lecturer}
          className="ml-4 border-2 rounded-md p-2 mt-2"
          onChange={(e) =>
            setFilter((prev: any) => ({
              ...prev,
              lecturer: e.target.value,
            }))
          }
          defaultValue={""}
        >
          <option value="" disabled>
            Tìm theo giảng viên
          </option>
          <option value="">Tất cả</option>
          {lecturerList?.map((lecture: any) => (
            <option key={lecture} value={lecture}>
              {lecture}
            </option>
          ))}
        </select>
        <input
          name="search"
          id=""
          className="w-[140px] ml-4 border-2 rounded-md p-2 mt-2"
          placeholder="Tìm theo lớp"
          value={filter.classId}
          onChange={(e) => {
            setFilter((prev: any) => ({
              ...prev,
              classId: e.target.value,
            }));
          }}
        />
        <div className="ml-4">
          <span className="">Lọc sĩ số {`(≤ ${filter?.studentCount})`} </span>
          <span className="flex gap-2 items-center">
            <input
              type="range"
              defaultValue={100}
              value={filter.studentCount}
              min={
                Math.min(
                  ...Object.values(studentCount).map((value) => Number(value))
                ) ?? 0
              }
              max={
                Math.max(
                  ...Object.values(studentCount).map((value) => Number(value))
                ) ?? 100
              }
              onChange={(e) => {
                if (Object.keys(studentCount).length === 0) {
                  alert(`Cần phải lấy sĩ số lớp trước`);
                } else {
                  setFilter((prev: any) => ({
                    ...prev,
                    studentCount: e.target.value,
                  }));
                }
              }}
            />
          </span>
        </div>

        <span
          className="cursor-pointer inline-block ml-4 mt-1 rounded-full !text-sm py-2 px-2 font-semibold bg-slate-500 hover:bg-slate-400 text-white"
          onClick={() =>
            setFilter({
              lecturer: "",
              classId: "",
              studentCount:
                Object.values(studentCount).length > 0
                  ? Math.max(
                      ...Object.values(studentCount).map((value) =>
                        Number(value)
                      )
                    ) ?? 100
                  : 100,
              excludeSlots: [],
              excludeWeekdays: [],
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default FilterSection;
