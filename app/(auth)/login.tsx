import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/auth";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { signIn } = useAuth();

	const handleLogin = async () => {
		if (!email || !password) {
			setError("Please enter both email and password");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await signIn(email, password);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Welcome to WECS</Text>
					<Text style={styles.subtitle}>Sign in to your account</Text>
				</View>

				{error ? (
					<View style={styles.errorContainer}>
						<Feather name="alert-circle" size={20} color="#dc2626" />
						<Text style={styles.errorText}>{error}</Text>
					</View>
				) : null}

				<View style={styles.form}>
					<View style={styles.inputContainer}>
						<Feather
							name="mail"
							size={20}
							color="#64748b"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Email"
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
							editable={!isLoading}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Feather
							name="lock"
							size={20}
							color="#64748b"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							editable={!isLoading}
						/>
					</View>

					<TouchableOpacity
						style={[styles.button, isLoading && styles.buttonDisabled]}
						onPress={handleLogin}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text style={styles.buttonText}>Sign In</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		padding: 24,
	},
	header: {
		alignItems: "center",
		marginBottom: 32,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: "#0f172a",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#64748b",
	},
	form: {
		gap: 16,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		paddingHorizontal: 16,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		height: 48,
		fontSize: 16,
		color: "#0f172a",
	},
	button: {
		height: 48,
		backgroundColor: "#0f172a",
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	errorContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fef2f2",
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		gap: 8,
	},
	errorText: {
		color: "#dc2626",
		flex: 1,
	},
});
