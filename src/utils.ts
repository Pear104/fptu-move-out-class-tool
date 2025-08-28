import * as cheerio from "cheerio";

export function mapToObject(map: Map<string, Map<string, string[]>>) {
  const obj: any = {};
  map.forEach((value, key: any) => {
    obj[key] = {};
    value.forEach((innerValue, innerKey) => {
      obj[key][innerKey] = innerValue;
    });
  });
  return obj;
}

export function objectToMap(obj: any): Map<string, Map<string, string[]>> {
  const map = new Map<string, Map<string, string[]>>();
  for (const [key, value] of Object.entries(obj as { [s: string]: unknown })) {
    const innerMap = new Map<string, string[]>();
    for (const [innerKey, innerValue] of Object.entries(
      value as { [s: string]: string[] }
    )) {
      innerMap.set(innerKey, innerValue);
    }
    map.set(key, innerMap);
  }
  return map;
}

export const textToColor = (text: string): string => {
  const intensity = 120;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 255;
    // Increase each RGB component to make the color lighter
    value = Math.min(value + intensity, 255); // Add 100 to make it lighter
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

export const getClassKey = (isRegisterCourse: boolean = false): any => {
  const id = window.location.href.slice(window.location.href.indexOf("=") + 1);

  const selectId = isRegisterCourse
    ? "#ctl00_mainContent_ddlGroups"
    : "#ctl00_mainContent_dllCourse";

  let data: string = document.querySelector(selectId)?.innerHTML || "";
  const $ = cheerio.load(data);
  let classes = new Map<string, string>();
  classes.set(
    document.getElementById("ctl00_mainContent_lblOldGroup")?.innerText || "",
    id
  );
  $("option").each((_i, e) => {
    const value = $(e).attr("value");
    if (value) {
      classes.set($(e).text(), value);
    }
  });

  return classes;
};

export const send = async (subject: string, formData: any) => {
  const response = await fetch(
    "https://fap.fpt.edu.vn/FrontOffice/Courses.aspx",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
      },
      referrer: "https://fap.fpt.edu.vn/FrontOffice/Courses.aspx",
      referrerPolicy: "same-origin",
      body: `__EVENTTARGET=${subject}&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=${formData.__VIEWSTATE}&__VIEWSTATEGENERATOR=${formData.__VIEWSTATEGENERATOR}&__VIEWSTATEENCRYPTED=&__EVENTVALIDATION=${formData.__EVENTVALIDATION}&ctl00%24mainContent%24txtNewGroup=&ctl00%24mainContent%24ddlCampuses=${formData.ctl00_mainContent_ddlCampuses}&ctl00%24mainContent%24hdException=Index+was+out+of+range.+Must+be+non-negative+and+less+than+the+size+of+the+collection.%0D%0AParameter+name%3A+index`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  // console.log("redirect ne");
  // console.log(response);
  // const data = await response.text();
  // console.log(data);
  if (response.redirected) {
    // Automatically redirected
    window.location.href = response.url;
  } else if (response.status >= 300 && response.status < 400) {
    // Manual handling of redirects
    const location = response.headers.get("Location");
    if (location) {
      window.location.href = location;
    }
  } else {
    // Process the response normally
    const data = await response.text();
  }
};

export const getCurrentSubjects = async () => {
  // const response = await fetch(
  const response = await fetch(
    "https://fap.fpt.edu.vn/FrontOffice/Courses.aspx",
    {
      method: "GET",
    }
  ).then((res) => res.text());
  const $ = cheerio.load(response);
  const currentSubjects = $("#ctl00_mainContent_gvCourses tbody tr:not(:first)")
    .map((_i, e) => {
      return {
        classId: $(e).find("td:nth-child(1)").text(),
        subject: $(e).find("td:nth-child(2)").text(),
        lecturer: $(e).find("td:nth-child(5)").text(),
        moveId: $(e).find("td:nth-child(7) a").attr("id"),
      };
    })
    .get();
  // console.log(currentSubjects);
  const __VIEWSTATE = encodeURIComponent($("#__VIEWSTATE").attr("value") || "");
  const __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").attr("value");
  const __EVENTVALIDATION = encodeURIComponent(
    $("#__EVENTVALIDATION").attr("value") || ""
  );
  const ctl00_mainContent_ddlCampuses = $(
    "#ctl00_mainContent_ddlCampuses option:nth-child(1)"
  ).attr("value");
  return {
    currentSubjects,
    __VIEWSTATE,
    __VIEWSTATEGENERATOR,
    __EVENTVALIDATION,
    ctl00_mainContent_ddlCampuses,
  };
};

export const getCurrentStatus = async () => {
  const response = await fetch(
    "https://fap.fpt.edu.vn/Course/Courses.aspx"
  ).then((res) => res.text());
  const $ = cheerio.load(response);
  const classCode =
    (
      document.getElementById("ctl00_mainContent_lblSubject")?.textContent || ""
    ).match(/^(.*?)(?=\s*-)/)?.[1] || "";

  let currentLink = $(
    "#ctl00_mainContent_divDepartment table tr:nth-child(1) td a"
  ).attr("href");

  currentLink = currentLink?.replace(/(.*?&[^&]+)=[^&]+$/, "$1");

  let campusName = "";
  const campus = $("#ctl00_lblCampusName").text().trim();
  console.log(campus);
  if (campus.includes("Hòa Lạc")) {
    campusName = "hola";
  } else {
    campusName = "xavalo";
  }
  const deptData = await fetch(
    "https://pear104.github.io/fptu-move-out-class-tool/dept.json"
  ).then((res) => res.json());

  let deptNum = Object.keys((deptData as any)[campusName]).filter((item) =>
    item.includes(classCode.toLowerCase())
  )?.[0];

  const link = `https://fap.fpt.edu.vn/Course/Courses.aspx${currentLink}=${
    (deptData as { [key: string]: { [key: string]: number } })[campusName][
      deptNum
    ]
  }`;

  console.log(link);
  const res = await fetch(link, {
    priority: "low",
    keepalive: false,
  }).then((res) => res.text());

  const $$$ = cheerio.load(res);

  const subject = $$$("#id tr")
    .filter((_, el) =>
      $(el)
        .find("td:nth-child(1)")
        .text()
        .toLowerCase()
        .includes(classCode.toLowerCase())
    )
    .first();

  // const campus = $("#ctl00_lblCampusName").text().trim();
  // console.log(campus);

  let result: any = {};
  subject.find('td:nth-child(2) a[href^="Groups.aspx"]').each((_, el) => {
    const course = $(el).text().trim();
    const number = ($(el)[0].nextSibling as any).nodeValue
      .split("|")[1]
      .trim()
      .split("-(")[0];
    result[course] = number;
  });
  subject.find('td:nth-child(3) a[href^="Groups.aspx"]').each((_, el) => {
    const course = $(el).text().trim();
    const number = ($(el)[0].nextSibling as any).nodeValue
      .split("|")[1]
      .trim()
      .split("-(")[0];
    result[course] = number;
  });
  return result;
};

export const getLecturerList = async () => {
  const response = await fetch(
    "https://fap.fpt.edu.vn/FrontOffice/Courses.aspx"
  ).then((r) => r.text());
  const $ = cheerio.load(response);
  const lecturerList = $("#ctl00_mainContent_ddlCampuses option")
    .map((_i, e) => {
      return $(e).text();
    })
    .get();
  return lecturerList;
};

export const handleDownload = () => {
  const title = `${document.querySelector("#class-id")?.textContent}-${
    document.querySelector("#ctl00_mainContent_lblOldGroup")?.textContent
  }`;
  const link = document.createElement("a");
  const $ = cheerio.load(
    document.getElementById("ctl00_mainContent_divStudents")?.innerHTML || ""
  );
  const result = $("tbody tr")
    .map(
      (_i, e) =>
        `${$(e).find("td:nth-child(3)").text()}, ${$(e)
          .find("td:nth-child(4)")
          .text()
          .trim()} ${$(e).find("td:nth-child(5)").text().trim()} ${$(e)
          .find("td:nth-child(6)")
          .text()
          .trim()}`
    )
    .get()
    .join("\n");
  // Encode the text as UTF-8
  const utf8Result = new TextEncoder().encode(result);
  const file = new Blob([utf8Result], { type: "text/plain;charset=utf-8" });
  link.href = URL.createObjectURL(file); // Create a url to download
  link.download = `${title}.txt`; // File name
  link.click(); // Click the url to download
  URL.revokeObjectURL(link.href); // Invoke the download url
  console.log(result);
};

export const cleanTimetable = async (document: Document | undefined) => {
  const labels = document?.querySelectorAll(".label.label-primary");
  labels?.forEach((label) => {
    label.innerHTML = "";
  });
  document?.querySelector(".container .row:nth-child(1)")?.remove();
  document?.querySelector(".breadcrumb")?.remove();
  document?.querySelector("tbody tr:nth-child(2)")?.remove();
  document?.querySelectorAll("td > div > p").forEach((item) => item.remove());
  document?.querySelectorAll("h2").forEach((item) => item.remove());
  document?.querySelector("#ctl00_mainContent_divfoot")?.remove();
  document?.querySelector("#ctl00_divUser")?.remove();
  document?.querySelector("#cssTable")?.remove();
  document?.querySelector('[id^="ctl00_divSupport"]')?.remove();
  document?.querySelector('[id^="ctl00_mainContent_ghichu"]')?.remove();
  document
    ?.querySelector(".container")
    ?.setAttribute(
      "style",
      "padding: 0px; margin: 0px; width: 100%;overflow-x: hidden;"
    );
  document
    ?.querySelector(".container > .row > .col-md-12")
    ?.setAttribute("style", "padding-right: 0px;");
};

// export function getCookie(cookieName: string) {
//   const name = cookieName + "=";
//   const decodedCookie = decodeURIComponent(document.cookie);
//   const ca = decodedCookie.split(";");
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == " ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }
