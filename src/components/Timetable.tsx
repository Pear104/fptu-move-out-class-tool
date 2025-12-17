import React from "react";
import { weekdays, slots } from "../constants/classData";
import { textToColor } from "../utils";
import * as cheerio from "cheerio";

interface TimetableProps {
  timeTable: Map<string, Map<string, string[]>> | undefined;
  filter: any;
  studentCount: any;
  getClassKey: (isRegisterCourse?: boolean) => Map<string, string>;
  sendTrackingEvent: () => Promise<void>;
  setIsLoading: (value: any) => void;
  formData: any;
  setIsFull: (value: boolean) => void;
  subject: string;
  setFilter: (value: any) => void;
  isRegisterCourse?: boolean;
}

const Timetable: React.FC<TimetableProps> = ({
  timeTable,
  filter,
  studentCount,
  getClassKey,
  sendTrackingEvent,
  setIsLoading,
  formData,
  setIsFull,
  subject,
  setFilter,
  isRegisterCourse,
}) => {
  const handleClassClick = async (item: string) => {
    const userConfirmed = window.confirm(
      `Bạn có chắc muốn chuyển qua lớp ${item} không?`
    );
    if (userConfirmed) {
      await sendTrackingEvent();
      setIsLoading((prev: any) => ({
        ...prev,
        moving: true,
      }));

      const classId = getClassKey(isRegisterCourse).get(item.split(" (")[0]);
      if (isRegisterCourse) {
        formData.set("ctl00$mainContent$ddlGroups", classId);
      } else {
        formData.set("ctl00$mainContent$dllCourse", classId);
      }
      formData.set("ctl00$mainContent$btSave", "Save");
      fetch(window.location.href, {
        method: "POST",
        headers: {},
        body: formData,
        priority: "high",
      })
        .then((res) => res.text())
        .then((text) => {
          if (isRegisterCourse) {
            const $ = cheerio.load(text);
            const alertTextRegex = $("#ctl00_mainContent_lblMessage").text();
            const match = text.match(alertTextRegex);
            if (alertTextRegex.startsWith("Bạn không thể đăng ký")) {
              alert(alertTextRegex);
            } else {
              alert("Yêu cầu của bạn đã được chấp nhận");
            }
          } else {
            const alertTextRegex = /alert\('([^']*)'\)/;
            const match = text.match(alertTextRegex);
            let res = match?.[1]?.replaceAll("</br>", "\n");
            if (res) {
              alert(res);
              if (res?.includes("Bạn không thể chuyển tới lớp này, bởi vì")) {
                setIsFull(true);
              }
              if (res?.includes("đã được chấp nhận")) {
                const url = new URL(window.location.href);
                if (classId) {
                  url.searchParams.set("id", classId);
                }
                localStorage.removeItem(subject);
                window.location.href =
                  "https://fap.fpt.edu.vn/FrontOffice/MoveSubject.aspx?id=" +
                  getClassKey().get(item.split(" ")[0]);
              } else if (
                res?.includes("Bạn không thể chuyển tới lớp này, bởi vì")
              ) {
                setIsFull(true);
              }
            } else {
              alert("Bạn đã ở trong lớp này rồi");
            }
          }

          setIsLoading((prev: any) => ({
            ...prev,
            moving: false,
          }));
        });
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="">
          <td className="text-white bg-blue-500 font-bold p-2 w-[100px] text-center rounded-tl-2xl"></td>
          {weekdays.map((day) => (
            <td
              key={day}
              className={`text-white bg-blue-500 font-bold border px-2 py-3 w-[200px] text-center ${
                day == "Sun" && "rounded-tr-2xl border-transparent"
              }`}
            >
              <label
                htmlFor={day}
                className="flex justify-center items-center gap-2 !m-0 cursor-pointer"
              >
                <input
                  defaultChecked
                  className="!mt-0"
                  type="checkbox"
                  id={day}
                  checked={!filter.excludeWeekdays.includes(day)}
                  onChange={(e) => {
                    setFilter((prev: any) => ({
                      ...prev,
                      excludeWeekdays: !e.target.checked
                        ? [...filter.excludeWeekdays, day]
                        : filter.excludeWeekdays.filter(
                            (item: any) => item != day
                          ),
                    }));
                  }}
                />
                {day}
              </label>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {slots.map((slot: any) => (
          <tr className="" key={slot}>
            <td
              className={`text-white bg-blue-500 font-bold border w-[80px] text-center px-3 py-4 m-auto ${
                slot == "8" && "rounded-bl-2xl border-transparent"
              }`}
            >
              <label
                htmlFor={slot}
                className="flex justify-center items-center gap-2 !m-0 cursor-pointer"
              >
                <input
                  defaultChecked
                  className="!mt-0"
                  type="checkbox"
                  id={slot}
                  checked={!filter.excludeSlots.includes(slot)}
                  onChange={(e) => {
                    setFilter((prev: any) => ({
                      ...prev,
                      excludeSlots: !e.target.checked
                        ? [...filter.excludeSlots, slot]
                        : filter.excludeSlots.filter(
                            (item: any) => item != slot
                          ),
                    }));
                  }}
                />
                Slot {slot}
              </label>
            </td>
            {weekdays.map((day) => (
              <td
                key={day}
                className="border col-span-1 p-2 w-[200px]"
                onClick={() => {}}
              >
                {timeTable
                  ?.get(day)
                  ?.get(slot)
                  ?.map((item: string) => {
                    return (
                      <div
                        key={item}
                        className={`border-[0.5px] border-black font-bold p-2 rounded-md mb-2 bg-opacity-5 cursor-pointer hover:scale-[1.03] duration-200 ${
                          item.includes(filter.lecturer) &&
                          item
                            .toLocaleLowerCase()
                            .includes(filter.classId.toLowerCase()) &&
                          (Object.keys(studentCount).length > 0
                            ? studentCount?.[item.split(" ")[0]] <=
                              filter.studentCount
                            : true) &&
                          !filter.excludeWeekdays.includes(day) &&
                          !filter.excludeSlots.includes(slot)
                            ? ""
                            : "hidden"
                        }`}
                        style={{
                          backgroundColor: textToColor(item),
                        }}
                        // title={`${item.split(" ")[0]} - ${getClassKey(true)}`}
                        title={getClassKey(true).get(item.split(" (")[0]) || ""}
                        // onClick={() => {
                        //   console.log(item);
                        //   console.log(getGroupId(item.split(" (")[0]));
                        // }}
                        onClick={() => handleClassClick(item)}
                      >
                        {item.split("\n").map((line, index) => (
                          <React.Fragment key={line + index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                        <span className="text-lg mt-1">
                          {`${studentCount?.[item.split(" ")[0]] ?? ""} ${
                            studentCount?.[item.split(" ")[0]] ? "students" : ""
                          }`}
                        </span>
                      </div>
                    );
                  })}
              </td>
            ))}
          </tr>
        ))}
        {/* Test cell */}
        {/* <tr className="" key={"123"}>
          <td className="text-white bg-blue-500 font-bold border w-[80px] text-center px-3 py-4 m-auto">
            <label
              htmlFor={"123"}
              className="flex justify-center items-center gap-2 !m-0 cursor-pointer"
            >
              <input
                defaultChecked
                className="!mt-0"
                type="checkbox"
                id={"123"}
                checked={!filter.excludeSlots.includes("123")}
                onChange={(e) => {
                  setFilter((prev: any) => ({
                    ...prev,
                    excludeSlots: !e.target.checked
                      ? [...filter.excludeSlots, "123"]
                      : filter.excludeSlots.filter(
                          (item: any) => item != "123"
                        ),
                  }));
                }}
              />
              Slot 123
            </label>
          </td>
          {weekdays.map((day) => (
            <td
              key={day}
              className="border col-span-1 p-2 w-[200px]"
              onClick={() => {}}
            >
              <div
                className={`border-[0.5px] border-black font-bold p-2 rounded-md mb-2 bg-opacity-5 cursor-pointer hover:scale-[1.03] duration-200`}
              >
                <React.Fragment>
                  Ahihi <br />
                </React.Fragment>
                <span className="text-lg mt-1">2 students</span>
              </div>
            </td>
          ))}
        </tr> */}
      </tbody>
    </table>
  );
};

export default Timetable;
