import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import RegisterCourse from "./RegisterCourse.tsx";
// import Test from "./Test.tsx";

const rootPath =
  "#aspnetForm > table > tbody > tr:nth-child(1) > td > div > h2";
// "#root";

document.querySelector(rootPath)?.appendChild(document.createElement("div"));

if (
  window.location.href.startsWith(
    "https://fap.fpt.edu.vn/FrontOffice/MoveSubject.aspx"
  )
) {
  ReactDOM.createRoot(document.querySelector(`${rootPath} div`)!).render(
    <App />
  );
} else if (
  window.location.href.startsWith(
    "https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx"
  )
) {
  const labels = document.querySelectorAll(`.label.label-primary`);
  labels.forEach((label) => {
    label.innerHTML = "";
  });
}
// else if (
//   window.location.href.startsWith(
//     "https://fap.fpt.edu.vn/FrontOffice/RegisterCourseFast.aspx"
//   )
// ) {
//   ReactDOM.createRoot(document.querySelector(`${rootPath} div`)!).render(
//     <RegisterCourse />
//   );
// }
