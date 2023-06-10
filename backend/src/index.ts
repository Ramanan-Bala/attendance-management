import bcrypt from "bcryptjs";
import { UserRoutes } from "./routes/user.routes";
import express from "express";
import cors from "cors";
import { sequelize } from "./db";
import {
  DayAttendanceRoutes,
  HourlyAttendanceRoutes,
  ReportRoutes,
  SectionRoutes,
  StudentRoutes,
  SubjectRoutes,
  SubjectSectionHoursRoutes,
  TimeTableRoutes,
} from "./routes";

import {
  Subject,
  Section,
  TimeTable,
  Student,
  HourlyAttendance,
  DayAttendance,
  SubjectSectionHours,
  User,
  Year,
} from "./models";
import { verifyToken } from "./middleware";

import { google } from "googleapis";
import * as googleAuth from "google-auth-library";
import * as fs from "fs";
import path from "path";

// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
// const KEY_FILE = __dirname + "/keyfile.json";

// const auth = new googleAuth.GoogleAuth({
//   scopes: SCOPES,
//   keyFilename: KEY_FILE,
// });

// const drive = google.drive({
//   version: "v3",
//   auth: auth.fromJSON(JSON.parse(fs.readFileSync(KEY_FILE, "utf8"))),
// });

const app = express();

const allowlist = [
  "http://localhost:4200",
  "http://localhost",
  /^http:\/\/172\.16\.\d{1,3}\.\d{1,3}:88$/,
];

const corsOptions: any = {
  origin: function (origin: string, callback: any) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowlist.some((pattern) => new RegExp(pattern).test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Unauthorized"));
    }
  },
};

app.use(cors(corsOptions));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

User.sync().then(() => {
  User.findOne({ where: { email: "admin@local.com" } }).then((user) => {
    if (!user)
      bcrypt.hash("admin@123", 10).then((ep) => {
        User.create({
          name: "Admin",
          email: "admin@local.com",
          password: ep,
          role: "ADMIN",
        });
      });
  });
});
Year.sync().then(() => {
  Year.count().then((res) => {
    if (res < 4) {
      Year.sync({ force: true }).then(() => {
        Year.bulkCreate([
          { name: "I" },
          { name: "II" },
          { name: "III" },
          { name: "IV" },
        ]);
      });
    }
  });
});
Section.sync();
Subject.sync();
TimeTable.sync();
Student.sync();
HourlyAttendance.sync();
DayAttendance.sync();
SubjectSectionHours.sync();
// Reason.sync();

// this is the raw query
let query = `SELECT a.student_id, a.student_name, a.roll_no,
                  a.section_name,
                  sum(a.sub1_tot_hrs) sub1_tot_hrs,
                  sum(a.sub1_abs_hrs) sub1_abs_hrs,
                  sum(a.sub1_tot_hrs) - sum(a.sub1_abs_hrs) sub1_pre_hrs,
                  
                  sum(a.sub2_tot_hrs) sub2_tot_hrs,
                  sum(a.sub2_abs_hrs) sub2_abs_hrs,
                  
                  sum(a.sub3_tot_hrs) sub3_tot_hrs,
                  sum(a.sub3_abs_hrs) sub3_abs_hrs,
                  
                  sum(a.sub4_tot_hrs) sub4_tot_hrs,
                  sum(a.sub4_abs_hrs) sub4_abs_hrs,
                  
                  sum(a.sub5_tot_hrs) sub5_tot_hrs,
                  sum(a.sub5_abs_hrs) sub5_abs_hrs,
                  
                  sum(a.sub6_tot_hrs) sub6_tot_hrs,
                  sum(a.sub6_abs_hrs) sub6_abs_hrs
              FROM
              (
                SELECT s.id student_id, s.name student_name, s.roll_no,
                    sec.name section_name,
                    sum(case when sub.name = 'Sub1' then ssh.total_hours else 0 end) sub1_tot_hrs,
                    count(case when sub.name = 'Sub1' then ha.is_absent else null end) sub1_abs_hrs,
                    
                    sum(case when sub.name = 'Sub2' then ssh.total_hours else 0 end) sub2_tot_hrs,
                    count(case when sub.name = 'Sub2' then ha.is_absent else null end) sub2_abs_hrs,
                    
                    sum(case when sub.name = 'Sub3' then ssh.total_hours else 0 end) sub3_tot_hrs,
                    count(case when sub.name = 'Sub3' then ha.is_absent else null end) sub3_abs_hrs,
                    
                    sum(case when sub.name = 'Sub4' then ssh.total_hours else 0 end) sub4_tot_hrs,
                    count(case when sub.name = 'Sub4' then ha.is_absent else null end) sub4_abs_hrs,
                    
                    sum(case when sub.name = 'Sub5' then ssh.total_hours else 0 end) sub5_tot_hrs,
                    count(case when sub.name = 'Sub5' then ha.is_absent else null end) sub5_abs_hrs,
                    
                    sum(case when sub.name = 'Sub6' then ssh.total_hours else 0 end) sub6_tot_hrs,
                    count(case when sub.name = 'Sub6' then ha.is_absent else null end) sub6_abs_hrs
                    -- sum(case when sub.name = 'Sub1' then count(ha.is_absent) else 0 end) sub1_abs_hrs
                    -- ssh.total_hours  - count(ha.is_absent) pre_hours
                    -- count(case when ha.is_absent is null then 1 else null end) pre_hours
                  from students s cross join subjects sub
                  inner join sections sec on s.section_id = sec.id 
                  LEFT join hourly_attendances ha on s.id = ha.student_id and ha.subject_id = sub.id 
                  LEFT JOIN subject_section_hours ssh on ssh.subject_id = sub.id and ssh.section_id = sec.id 
                  -- WHERE sub.name = 'Sub1'
                  GROUP BY s.id, sec.id
                  ORDER BY s.name
              ) a
              GROUP BY a.student_id, a.section_name
              ORDER BY a.student_name
`;

app.use(express.json());

app.use(express.static(__dirname + "/attendance-management", { index: false }));
app.get(/^((?!(api)).)*$/, function (req, res) {
  res.sendFile(__dirname + "/attendance-management/index.html");
});

app.use("/api/users", new UserRoutes().getRouter());
app.use("/api/sections", verifyToken, new SectionRoutes().getRouter());
app.use("/api/subjects", verifyToken, new SubjectRoutes().getRouter());
app.use("/api/time-tables", verifyToken, new TimeTableRoutes().getRouter());
app.use("/api/students", verifyToken, new StudentRoutes().getRouter());
app.use(
  "/api/hourly-attendances",
  verifyToken,
  new HourlyAttendanceRoutes().getRouter()
);
app.use(
  "/api/day-attendances",
  verifyToken,
  new DayAttendanceRoutes().getRouter()
);
app.use(
  "/api/subject-section-hours",
  verifyToken,
  new SubjectSectionHoursRoutes().getRouter()
);

app.use("/api/report", verifyToken, new ReportRoutes().getRouter());
// app.use("/api/reason", verifyToken, new ReasonRoutes().getRouter());

app.get("/api/hourly-report", (req, res) => {
  sequelize.query(query).then((data) => {
    res.json(data);
  });
});

// app.get("/api/upload", async (req: any, res) => {
//   try {
//     const fileMetadata = {
//       name: new Date().toDateString() + ".sqlite",
//       parents: ["1txrsixiYOCS1uHGG88dsj_S4lW75ckwR"],
//     };
//     const media = {
//       mimeType: "application/x-sqlite3",
//       body: fs.createReadStream(path.join(__dirname + "/db/db.sqlite")),
//     };
//     const file: any = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });
//     res.send(`File ID: ${file.data.id}`);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: "Error uploading file" });
//   }
// });

// async function getLatestFile(): Promise<any> {
//   const files: any = await drive.files.list({
//     q: "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
//     orderBy: "createdTime desc",
//     fields: "files(name, createdTime, id)",
//   });
//   if (files.data.files.length === 0) {
//     throw new Error("No files found");
//   }

//   return files.data.files[0];
// }

// async function downloadFile(
//   fileId: string,
//   destinationPath: string
// ): Promise<void> {
//   const { data } = await drive.files.get(
//     { fileId, alt: "media" },
//     { responseType: "stream" }
//   );

//   const writeStream = fs.createWriteStream(destinationPath);
//   data.pipe(writeStream);

//   return new Promise((resolve, reject) => {
//     writeStream.on("finish", resolve);
//     writeStream.on("error", reject);
//   });
// }

// // Example usage
// app.get("/api/restore", async (req, res) => {
//   try {
//     const latestFile = await getLatestFile();
//     downloadFile(latestFile.id, __dirname + "/db/db.sqlite").then((finish) => {
//       res.send(
//         `Latest file: ${latestFile.name}, created on ${latestFile.createdTime}`
//       );
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error getting latest file");
//   }
// });

app.listen(3000, () => {
  console.log("App listening on port http://localhost:3000");
});
