export interface IEvaluation {
	_id: string;
	period: {
		start: string;
		end: string;
	};
	metrics: Array<{
		name: string;
		score: number;
		weight: number;
	}>;
	overallScore: number;
	comments: string;
	recommendations: string;
	evaluator: {
		name: string;
	};
}

export interface IMetric {
	name: string;
	score: number;
}

export interface ICreateEvaluation {
	employeeId: string;
	period: {
		start: Date;
		end: Date;
	};
	metrics: IMetric[];
	comments?: string;
	recommendations?: string;
}
export interface IUpdateEvaluation {
	overallScore?: number;
	metrics?: IMetric[];
	status?: "draft" | "submitted" | "reviewed" | "approved";
	comments?: string;
	recommendations?: string;
}
