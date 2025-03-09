import { useAuth } from "@/app/context/auth";
import { API_URL } from "@/constants/App";
import {
	ICreateEvaluation,
	IUpdateEvaluation,
	IMetric,
} from "@/interfaces/evaluation";
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
} from "react-native";

interface EmployeeLevel {
	level: number;
	baseSalary: number;
}

const SALARY_LEVELS: EmployeeLevel[] = [
	{ level: 0, baseSalary: 70000 },
	{ level: 1, baseSalary: 100000 },
	{ level: 2, baseSalary: 120000 },
	{ level: 3, baseSalary: 180000 },
	{ level: 4, baseSalary: 200000 },
	{ level: 5, baseSalary: 250000 },
];

interface EvaluationFormData {
	employeeId: string;
	period: {
		start: Date;
		end: Date;
	};
	metrics: IMetric[];
	comments: string;
	recommendations: string;
	overallScore?: number;
	status?: "draft" | "submitted" | "reviewed" | "approved";
}

interface UpdateFormData {
	comments?: string;
	recommendations?: string;
	metrics?: IMetric[];
	overallScore?: number;
	status?: "draft" | "submitted" | "reviewed" | "approved";
}

export const EmployeeEvaluation = ({
	employeeId,
	existingEvaluation,
	onClose,
}: {
	employeeId: string;
	existingEvaluation?: IUpdateEvaluation;
	onClose: () => void;
}) => {
	const { token } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
	const [score, setScore] = useState<number | null>(null);

	console.log("EmployeeEvaluation", existingEvaluation);

	const [evaluation, setEvaluation] = useState<EvaluationFormData>({
		employeeId,
		period: {
			start: new Date(),
			end: new Date(),
		},
		metrics: existingEvaluation?.metrics || [],
		comments: existingEvaluation?.comments || "",
		recommendations: existingEvaluation?.recommendations || "",
		overallScore: existingEvaluation?.overallScore,
		status: existingEvaluation?.status || "draft",
	});

	const handleChange = (key: keyof EvaluationFormData, value: any) => {
		setEvaluation((prev) => ({ ...prev, [key]: value }));
		setError(null);

		if (existingEvaluation) {
			setChangedFields((prev) => {
				const newSet = new Set(prev);
				newSet.add(key);
				return newSet;
			});
		}
	};

	const prepareCreatePayload = (): ICreateEvaluation => {
		return {
			employeeId: evaluation.employeeId,
			period: evaluation.period,
			metrics: evaluation.metrics,
			comments: evaluation.comments,
			recommendations: evaluation.recommendations,
		};
	};

	const prepareUpdatePayload = (): IUpdateEvaluation => {
		const updateData: IUpdateEvaluation = {};

		if (changedFields.has("comments")) {
			updateData.comments = evaluation.comments;
		}
		if (changedFields.has("recommendations")) {
			updateData.recommendations = evaluation.recommendations;
		}
		if (changedFields.has("metrics")) {
			updateData.metrics = evaluation.metrics;
		}
		if (changedFields.has("overallScore")) {
			updateData.overallScore = score as number;
		}
		if (changedFields.has("status")) {
			updateData.status = evaluation.status;
		}

		return updateData;
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const url = `${API_URL}/evaluations${
				existingEvaluation ? `/${employeeId}` : ""
			}`;
			const method = existingEvaluation ? "PATCH" : "POST";

			const submitData = existingEvaluation
				? prepareUpdatePayload()
				: prepareCreatePayload();

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(submitData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to submit evaluation");
			}

			onClose();
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.inputContainer}>
					<Text>OVerall Score</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter overall score"
						value={score?.toString()}
						onChangeText={(text) => setScore(Number(text))}
						keyboardType="numeric"
						placeholderTextColor="#999"
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Comments</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your comments here"
						value={evaluation.comments}
						onChangeText={(text) => handleChange("comments", text)}
						multiline
						numberOfLines={4}
						placeholderTextColor="#999"
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Recommendations</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your recommendations here"
						value={evaluation.recommendations}
						onChangeText={(text) => handleChange("recommendations", text)}
						multiline
						numberOfLines={4}
						placeholderTextColor="#999"
					/>
				</View>

				{error && <Text style={styles.errorText}>{error}</Text>}
			</View>

			<View style={styles.footer}>
				<TouchableOpacity style={styles.button} onPress={onClose}>
					<Text style={styles.buttonTextSecondary}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, styles.primaryButton]}
					onPress={handleSubmit}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="#fff" size="small" />
					) : (
						<Text style={styles.buttonTextPrimary}>
							{existingEvaluation ? "Update" : "Submit"}
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
	},
	content: {
		padding: 16,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: "#333",
		marginBottom: 6,
	},
	input: {
		backgroundColor: "#f8f8f8",
		borderRadius: 6,
		padding: 10,
		fontSize: 14,
		color: "#333",
		borderWidth: 1,
		borderColor: "#eee",
		textAlignVertical: "top",
	},
	footer: {
		flexDirection: "row",
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: "#eee",
		gap: 8,
	},
	button: {
		flex: 1,
		padding: 10,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#007AFF",
	},
	primaryButton: {
		backgroundColor: "#007AFF",
		borderWidth: 0,
	},
	buttonTextPrimary: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
	buttonTextSecondary: {
		color: "#007AFF",
		fontSize: 14,
		fontWeight: "500",
	},
	errorText: {
		color: "#dc2626",
		fontSize: 14,
		marginTop: 8,
	},
});
