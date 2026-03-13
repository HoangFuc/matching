//---------------------------------------
export interface IAttendanceToday {
  data: {
    checkedIn: boolean;
    checkInTime: string | null;
  };
}

//---------------------------------------
export interface IAttendanceRecord {
  id: string;
  userId: string;
  companyId: string;
  checkInDate: string;
  checkInTime: string;
  isLate: boolean;
  latitude: string;
  longitude: string;
  createdAt: string;
}

//---------------------------------------
export interface IAttendanceSummary {
  onTime: number;
  late: number;
  absent: number;
}

//---------------------------------------
export interface IMyAttendanceResponse {
  records: IAttendanceRecord[];
  summary: IAttendanceSummary;
}
