//---------------------------------------
export interface IAttendanceToday {
  data: {
    checkedIn: boolean;
    checkInTime: string | null;
  };
}

//---------------------------------------
export interface IAttendanceRecord {
  checkInDate: string;
  checkInTime: string;
}

//---------------------------------------
export interface IMyAttendanceResponse {
  data: IAttendanceRecord[];
}
