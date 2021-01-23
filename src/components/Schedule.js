import React from "react";
import { Table } from "react-bootstrap";

function get_tex_width(txt, font) {
  var element = document.createElement("canvas");
  element.className = "textDimensionCalculation";
  var context = element.getContext("2d");
  context.style = "height: auto; width: auto;white-space: nowrap;";
  context.font = font;
  return context.measureText(txt).width;
}

const getTimeString = (startHour, offset) => {
  const isPM = startHour + offset >= 12;
  let hour =
    isPM && startHour + offset !== 12
      ? startHour + offset - 12
      : startHour + offset;
  return (
    (hour > 12 ? (hour - 12).toString() : hour.toString()) +
    ":00 " +
    (isPM ? "PM" : "AM")
  );
};

const getTimeBounds = (lecture, section) => {
  let earliest = [11, 59, "PM"];
  let latest = [12, 0, "AM"];
  for (let times of lecture.times) {
    // Check for earliest
    let time = times.begin.split(":");
    time.push(time[1].slice(2, 4));
    time[0] = parseInt(time[0]);
    time[1] = parseInt(time[1].slice(0, 2));
    if (time[2] === earliest[2]) {
      if (time[0] === earliest[0]) {
        if (time[1] < earliest[1]) {
          earliest[1] = time[1];
        }
      } else if (time[0] < earliest[0]) {
        earliest[0] = time[0];
        earliest[1] = time[1];
      }
    } else if (time[2] === "AM") {
      earliest[0] = time[0];
      earliest[1] = time[1];
      earliest[2] = time[2];
    }

    // Check for latest
    time = times.end.split(":");
    time.push(time[1].slice(2, 4));
    time[0] = parseInt(time[0]);
    time[1] = parseInt(time[1].slice(0, 2));

    if (time[2] === latest[2]) {
      if (time[0] === latest[0]) {
        if (time[1] > latest[1]) {
          latest[1] = time[1];
        }
      } else if (time[0] > latest[0]) {
        latest[0] = time[0];
        latest[1] = time[1];
      }
    } else if (time[2] === "PM") {
      latest[0] = time[0];
      latest[1] = time[1];
      latest[2] = time[2];
    }
  }

  for (let times of section.times) {
    // Check for earliest
    let time = times.begin.split(":");
    time.push(time[1].slice(2, 4));
    time[0] = parseInt(time[0]);
    time[1] = parseInt(time[1].slice(0, 2));

    if (time[2] === earliest[2]) {
      if (time[0] === earliest[0]) {
        if (time[1] < earliest[1]) {
          earliest[1] = time[1];
        }
      } else if (time[0] < earliest[0]) {
        earliest[0] = time[0];
        earliest[1] = time[1];
      }
    } else if (time[2] === "AM") {
      earliest[0] = time[0];
      earliest[1] = time[1];
      earliest[2] = time[2];
    }

    // Check for latest
    time = times.end.split(":");
    time.push(time[1].slice(2, 4));
    time[0] = parseInt(time[0]);
    time[1] = parseInt(time[1].slice(0, 2));

    if (time[2] === latest[2]) {
      if (time[0] === latest[0]) {
        if (time[1] > latest[1]) {
          latest[1] = time[1];
        }
      } else if (time[0] > latest[0]) {
        latest[0] = time[0];
        latest[1] = time[1];
      }
    } else if (time[2] === "PM") {
      latest[0] = time[0];
      latest[1] = time[1];
      latest[2] = time[2];
    }
  }

  const start =
    earliest[2] === "PM" && earliest[0] !== 12 ? earliest[0] + 12 : earliest[0];
  const end =
    latest[2] === "PM" && latest[0] !== 12 ? latest[0] + 12 : latest[0];
  console.log(end)

  return [start - 1, end - start + 2];
};

const normalizeTime = (time) => {
  let times = time.split(":");
  return `${parseInt(times[0])}:${times[1].slice(0, 2)} ${times[1].slice(2, 4)}`
}

const getEntries = (lecture, section, courseID) => {
  let result = [];
  for (let time of lecture.times) {
    for (let day of time.days) {
      result.push({
        day: day,
        begin: time.begin,
        building: time.building,
        end: time.end,
        room: time.room,
        lecsec: lecture.name,
        courseID: courseID,
      });
    }
  }

  for (let time of section.times) {
    for (let day of time.days) {
      result.push({
        day: day,
        begin: time.begin,
        building: time.building,
        end: time.end,
        room: time.room,
        lecsec: section.name,
        courseID: courseID,
      });
    }
  }

  return result;
};

const ScheduleTimes = (props) => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "right",
        paddingRight: "4px",
        paddingTop: "4px",
      }}
    >
      {props.time}
    </div>
  );
};

const ScheduleGrid = (props) => {
  return (
    <React.Fragment>
      {Array.apply(null, Array(props.rows))
        .map((x, i) => i)
        .map((i) => (
          <React.Fragment key={i}>
            <tr>
              <td className="schedule-row px-0 py-0" rowspan={2}>
                <ScheduleTimes time={getTimeString(props.start, i)} />
              </td>
              <td className="schedule-row schedule-upper-half"></td>
              <td className="schedule-row schedule-upper-half"></td>
              <td className="schedule-row schedule-upper-half"></td>
              <td className="schedule-row schedule-upper-half"></td>
              <td className="schedule-row schedule-upper-half"></td>
              <td className="schedule-row schedule-upper-half"></td>
              <td className="schedule-row schedule-upper-half"></td>
            </tr>
            <tr>
              <td className="schedule-row schedule-lower-half"></td>
              <td className="schedule-row schedule-lower-half"></td>
              <td className="schedule-row schedule-lower-half"></td>
              <td className="schedule-row schedule-lower-half"></td>
              <td className="schedule-row schedule-lower-half"></td>
              <td className="schedule-row schedule-lower-half"></td>
              <td className="schedule-row schedule-lower-half"></td>
            </tr>
          </React.Fragment>
        ))}
    </React.Fragment>
  );
};

const ScheduleEntry = (props) => {
  const start = props.start.split(/:| /);
  const end = props.end.split(/:| /);
  const startDist =
    start[2] === "PM" && end[0] !== "12"
      ? (parseInt(start[0]) + 12 - props.schedStart) * 80 +
        (parseInt(start[1]) / 60) * 80
      : (parseInt(start[0]) - props.schedStart) * 80 +
        (parseInt(start[1]) / 60) * 80;
  const endDist =
    end[2] === "PM" && end[0] !== "12"
      ? (parseInt(end[0]) + 12 - props.schedStart) * 80 +
        (parseInt(end[1]) / 60) * 80
      : (parseInt(end[0]) - props.schedStart) * 80 +
        (parseInt(end[1]) / 60) * 80;
  const height = endDist - startDist;

  return (
    <div
      style={{
        position: "absolute",
        top: `calc(35px + ${startDist}px)`,
        left: `calc(10% + ${props.day * 13}% + 4px)`,
        height: height,
        width: "12%",
        backgroundColor: "#139AD0",
        border: "0px solid #fff",
        borderRadius: "4px",
        textAlign: "center",
        color: "white",
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "2px",
          height: "100%",
          width: "100%",
        }}
      >
        <p
          style={{
            marginTop: "-2px",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {props.courseID} {props.lecsec}
        </p>
        <div
          className="noScrollbar"
          style={{
            overflow: "scroll",
            position: "absolute",
            top: "20px",
            backgroundColor: "#1FB1EA",
            height: "calc(100% - 20px - 2px)",
            width: "calc(100% - 4px)",
            borderRadius: "2px",
            paddingTop: "3px",
          }}
        >
          <p style={{ fontSize: "0.8rem", margin: "0" }}>
            {props.start} - {props.end}
          </p>
          <p style={{ fontSize: "0.8rem", margin: "0" }}>{props.location}</p>
        </div>
      </div>
    </div>
  );
};

export const Schedule = (props) => {
  const schedule = props.schedules[props.schedules.length - 1];
  const lecture = schedule.lectures[1];
  const section = schedule.sections[1];

  const [start, hours] = getTimeBounds(lecture, section);
  const entries = getEntries(lecture, section, schedule.courseID);

  let table = (
    <Table bordered style={{ borderRadius: "2px", position: "relative" }}>
      {entries.map(x => (
        <ScheduleEntry
          day={x.day}
          schedStart={start}
          start={normalizeTime(x.begin)}
          end={normalizeTime(x.end)}
          courseID={x.courseID}
          lecsec={x.lecsec}
          location={x.building ? `${x.building} ${x.room}` : x.room}
        />
      ))}
      <tr>
        <td className="text-center py-1" style={{ width: "10%" }}></td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Sun (U)
        </td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Mon (M)
        </td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Tue (T)
        </td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Wed (W)
        </td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Thu (R)
        </td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Fri (F)
        </td>
        <td
          className="schedule-header text-center py-1"
          style={{ width: "13%" }}
        >
          Sat (S)
        </td>
      </tr>
      <tr style={{ height: "2px", backgroundColor: "#dee2e6" }}>
        <td className="py-0" colSpan={8} />
      </tr>
      <ScheduleGrid start={start} rows={hours} />
    </Table>
  );

  return table;
};
