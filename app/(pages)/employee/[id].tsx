import { useState, useRef, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Alert,
	TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";
import { API_URL } from "@/constants/App";
import { useAuth } from "@/app/context/auth";
import { ActivityIndicator, FAB } from "react-native-paper";
import { EvaluationModal } from "@/components/employee/EvaluationModel";
import { EmployeeEvaluation } from "@/components/employee/Evaluation";

const LEVEL_SALARIES: { [key: number]: number } = {
	0: 70000,
	1: 100000,
	2: 120000,
	3: 180000,
	4: 200000,
	5: 250000,
};

export default function EmployeeDetail() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const { token } = useAuth();
	const [modalVisible, setModalVisible] = useState(false);

	const {
		data: employee,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["employee", id],
		queryFn: async () => {
			if (!token) {
				Alert.alert(error?.message as string);
				router.replace("/(auth)/login");
			}
			const response = await fetch(`${API_URL}/employees/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) throw new Error("Failed to fetch employee");
			return response.json();
		},
	});

	const {
		data: performance,
		isLoading: isPerformanceLoading,
		refetch: refetchPerformance,
	} = useQuery({
		queryKey: ["performance", id],
		queryFn: async () => {
			const response = await fetch(`${API_URL}/evaluations/employee/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) return null;
			return response.json();
		},
	});

	const handleEvaluationUpdate = async (newScore: number) => {
		try {
			const method = performance ? "PUT" : "POST";
			const endpoint = performance ? `/employee/${id}` : "";
			const response = await fetch(`${API_URL}/evaluations/${endpoint}`, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ score: newScore }),
			});

			if (!response.ok) throw new Error("Failed to update evaluation");

			Alert.alert("Success", "Employee evaluation updated successfully", [
				{ text: "OK", onPress: () => refetchPerformance() },
			]);
		} catch (error) {
			Alert.alert("Error", "Failed to update evaluation");
		}
	};

	if (isLoading || !employee) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size={"small"} />
			</View>
		);
	}

	console.log("performance", performance);

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<View style={styles.avatarContainer}>
						<Text style={styles.avatarText}>
							{employee.name
								.split(" ")
								.map((n: string) => n[0])
								.join("")}
						</Text>
					</View>
					<Text style={styles.name}>{employee.name}</Text>
					<Text style={styles.designation}>{employee.designation}</Text>
				</View>

				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<Feather name="bar-chart-2" size={20} color="#64748b" />
						<Text style={styles.cardTitle}>Performance Metrics</Text>
					</View>

					<View style={styles.metricsContainer}>
						<View style={styles.metric}>
							<Text style={styles.metricLabel}>Current Score</Text>
							<Text style={styles.metricValue}>
								{performance?.score ?? "N/A"}
							</Text>
						</View>

						<View style={styles.metric}>
							<Text style={styles.metricLabel}>Level</Text>
							<Text style={styles.metricValue}>Level {employee.level}</Text>
						</View>
					</View>
				</View>
			</ScrollView>

			<FAB
				style={styles.fab}
				icon="plus"
				onPress={() => setModalVisible(true)}
				label="Update Evaluation"
			/>

			<EvaluationModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onUpdateEvaluation={handleEvaluationUpdate}
			>
				<EmployeeEvaluation
					employeeId={id as string}
					existingEvaluation={performance}
					onClose={() => setModalVisible(false)}
				/>
			</EvaluationModal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 100,
		elevation: 3,
		padding: 3,
		backgroundColor: "white",
	},
	header: {
		alignItems: "center",
		padding: 24,
		backgroundColor: "white",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#0f172a",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	avatarText: {
		color: "white",
		fontSize: 24,
		fontWeight: "600",
	},
	name: {
		fontSize: 24,
		fontWeight: "600",
		color: "#0f172a",
		marginBottom: 4,
	},
	designation: {
		fontSize: 16,
		color: "#64748b",
	},
	card: {
		margin: 16,
		padding: 16,
		backgroundColor: "white",
		borderRadius: 12,
		elevation: 3,
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		gap: 8,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#0f172a",
	},
	metricsContainer: {
		gap: 16,
	},
	metric: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	metricLabel: {
		fontSize: 16,
		color: "#64748b",
	},
	metricValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#0f172a",
	},
	fab: {
		position: "absolute",
		right: 16,
		bottom: 20,
		backgroundColor: "#007bff",
	},
	bottomSheetContent: {
		padding: 16,
	},
	sheetTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
	},
	sheetOption: {
		padding: 12,
		backgroundColor: "#e2e8f0",
		marginBottom: 8,
		borderRadius: 8,
		alignItems: "center",
	},
	sheetOptionText: {
		fontSize: 16,
		fontWeight: "500",
	},
});
