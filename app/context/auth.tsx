// app/context/auth.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRootNavigationState } from "expo-router";
import { API_URL } from "@/constants/App";

interface AuthState {
	token: string | null;
	user: any | null;
	isLoading: boolean;
}

interface AuthContextType extends AuthState {
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, setState] = useState<AuthState>({
		isLoading: true,
		token: null,
		user: null,
	});

	useEffect(() => {
		loadToken();
	}, []);

	async function loadToken() {
		try {
			const token = await AsyncStorage.getItem("userToken");
			const userStr = await AsyncStorage.getItem("userData");
			const user = userStr ? JSON.parse(userStr) : null;

			setState({
				token,
				user,
				isLoading: false,
			});
		} catch (error) {
			setState({
				token: null,
				user: null,
				isLoading: false,
			});
		}
	}

	const authContext = {
		...state,
		signIn: async (email: string, password: string) => {
			try {
				const response = await fetch(`${API_URL}/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				});

				const data = await response.json();
				console.log("login data");
				console.log(data);

				if (!response.ok) {
					throw new Error(data.error || "Login failed");
				}

				await AsyncStorage.setItem("userToken", data.token);
				await AsyncStorage.setItem("userData", JSON.stringify(data.user));

				setState({
					...state,
					token: data.token,
					user: data.user,
				});

				router.replace("/");
			} catch (error: any) {
				throw new Error(error.message);
			}
		},
		signOut: async () => {
			try {
				await AsyncStorage.removeItem("userToken");
				await AsyncStorage.removeItem("userData");
				setState({
					...state,
					token: null,
					user: null,
				});
				router.replace("/(auth)/login");
			} catch (error) {
				console.error("Error signing out:", error);
			}
		},
	};

	return (
		<AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
