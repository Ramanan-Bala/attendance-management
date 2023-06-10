import { Student } from ".";

export interface Attendance {
  id: string;
  student: Student;
  date: string;
  present: boolean;
}
