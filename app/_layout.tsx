import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { View, StyleSheet } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<Stack
							initialRouteName="(auth)/login"
							screenOptions={{
								headerStyle: { backgroundColor: "#f8fafc" },
								headerTintColor: "#0f172a",
								headerTitleStyle: { fontWeight: "600" },
							}}
						>
							<Stack.Screen
								name="(auth)/login"
								options={{
									title: "WECS Login",
									headerShadowVisible: true,
								}}
							/>
							<Stack.Screen
								name="index"
								options={{
									title: "WECS Dashboard",
									headerShadowVisible: false,
								}}
							/>
							<Stack.Screen
								name="(pages)/employee/[id]"
								options={{
									title: "Employee Details",
									headerShadowVisible: false,
								}}
							/>
						</Stack>
					</AuthProvider>
				</QueryClientProvider>
			</View>
		</GestureHandlerRootView>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		backgroundColor: "#f8fafc",
	},
});
