export interface IDepartment {
	_id: string;
	name: string;
}

export interface IEmployee {
	_id: string;
	name: string;
	email: string;
	department: IDepartment;
	designation: string;
	level: number;
	salary: number;
	performanceId: string;
	performanceScore: number;
	status: "active" | "warning";
	joinDate: string | Date;
	createdAt: string | Date;
	updatedAt: string | Date;
	__v: number;
}
