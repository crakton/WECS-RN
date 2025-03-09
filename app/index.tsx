import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { IEmployee } from "@/interfaces/employee";
import { API_URL } from "@/constants/App";
import { useAuth } from "./context/auth";

export default function Home() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState("all");
	const { token } = useAuth();

	const {
		data: employees,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["employees"],
		queryFn: async () => {
			try {
				// Redirect to login if token is missing
				if (!token) {
					Alert.alert(error?.message as string);
					router.replace("/(auth)/login");
				}

				// Make API request with Authorization header
				const response = await fetch(`${API_URL}/employees`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				// Handle non-OK response
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				// Parse JSON response
				const data: IEmployee[] = await response.json();

				// Cache data locally
				await AsyncStorage.setItem("cachedEmployees", JSON.stringify(data));

				return data;
			} catch (error) {
				// Fallback: Retrieve cached employees if API fails
				const cached = await AsyncStorage.getItem("cachedEmployees");
				if (cached) return JSON.parse(cached);
				console.log();

				throw error;
			}
		},
	});

	const filteredEmployees = useMemo(
		() =>
			employees?.filter((emp: IEmployee) => {
				const matchesSearch =
					emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
				if (filter === "all") return matchesSearch;
				return matchesSearch && emp.status === filter;
			}),
		[]
	);

	console.log("employees", employees);
	const renderEmployee = ({ item }: { item: IEmployee }) => (
		<TouchableOpacity
			style={styles.employeeCard}
			onPress={() => router.push(`/employee/${item._id}`)}
		>
			<View style={styles.employeeInfo}>
				<Text style={styles.employeeName}>{item.name}</Text>
				<Text style={styles.employeeDesignation}>{item.designation}</Text>
				<Text style={styles.employeeDetail}>📧 {item.email}</Text>
				<Text style={styles.employeeDetail}>🏢 {item.department.name}</Text>
				<Text style={styles.employeeDetail}>
					💰 ${item.salary.toLocaleString()}
				</Text>
				<Text style={styles.employeeDetail}>
					📅 {new Date(item.joinDate).toLocaleDateString()}
				</Text>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						gap: 5,
					}}
				>
					<View style={styles.scoreContainer}>
						<Text style={{ color: "grey", padding: 4 }}>
							Level: {item.level}
						</Text>
					</View>
					<View style={styles.scoreContainer}>
						<Text
							style={[
								styles.scoreText,
								item.performanceScore >= 90
									? styles.highScore
									: item.performanceScore >= 50
									? styles.mediumScore
									: styles.lowScore,
							]}
						>
							Score: {item.performanceScore}
						</Text>
					</View>
				</View>
			</View>
			<Feather name="chevron-right" size={24} color="#64748b" />
		</TouchableOpacity>
	);

	if (error) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>Something went wrong</Text>
				<TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
					<Text style={styles.retryText}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<Feather
					name="search"
					size={20}
					color="#64748b"
					style={styles.searchIcon}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="Search employees..."
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
			</View>

			<View style={styles.filterContainer}>
				{["all", "active", "warning"].map((filterType) => (
					<TouchableOpacity
						key={filterType}
						style={[
							styles.filterButton,
							filter === filterType && styles.filterButtonActive,
						]}
						onPress={() => setFilter(filterType)}
					>
						<Text
							style={[
								styles.filterButtonText,
								filter === filterType && styles.filterButtonTextActive,
							]}
						>
							{filterType.charAt(0).toUpperCase() + filterType.slice(1)}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<FlatList
				data={filteredEmployees}
				renderItem={renderEmployee}
				keyExtractor={(item) => item._id.toString()}
				refreshing={isLoading}
				onRefresh={refetch}
				contentContainerStyle={styles.listContainer}
			/>
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
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		backgroundColor: "white",
		marginHorizontal: 16,
		marginTop: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#0f172a",
	},
	filterContainer: {
		flexDirection: "row",
		padding: 16,
		gap: 8,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#f1f5f9",
	},
	filterButtonActive: {
		backgroundColor: "#0f172a",
	},
	filterButtonText: {
		color: "#64748b",
		fontWeight: "500",
	},
	filterButtonTextActive: {
		color: "white",
	},
	listContainer: {
		padding: 16,
	},
	employeeCard: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		backgroundColor: "white",
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	employeeInfo: {
		flex: 1,
	},
	employeeName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#0f172a",
		marginBottom: 4,
	},
	employeeDesignation: {
		fontSize: 14,
		color: "#64748b",
		marginBottom: 8,
	},
	scoreContainer: {
		alignSelf: "flex-start",
	},
	employeeDetail: {
		fontSize: 14,
		color: "#64748b",
		marginBottom: 4,
	},
	scoreText: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
		overflow: "hidden",
		fontWeight: "500",
	},
	highScore: {
		backgroundColor: "#dcfce7",
		color: "#166534",
	},
	mediumScore: {
		backgroundColor: "#fef9c3",
		color: "#854d0e",
	},
	lowScore: {
		backgroundColor: "#fee2e2",
		color: "#991b1b",
	},
	errorText: {
		fontSize: 16,
		color: "#ef4444",
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: "#0f172a",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryText: {
		color: "white",
		fontWeight: "600",
	},
});
