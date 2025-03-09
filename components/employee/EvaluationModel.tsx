import React, { ReactNode } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable,
	Animated,
	Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
interface EvaluationModalProps {
	visible: boolean;
	onClose: () => void;
	onUpdateEvaluation: (score: number) => void;
	children: ReactNode;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
	visible,
	onClose,
	onUpdateEvaluation,
	children,
}) => {
	const fadeAnim = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: visible ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [visible]);

	const handleOptionPress = (score: number) => {
		onUpdateEvaluation(score);
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Animated.View
					style={[
						styles.modalContainer,
						{
							opacity: fadeAnim,
							transform: [
								{
									translateY: fadeAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [300, 0],
									}),
								},
							],
						},
					]}
				>
					<Pressable
						style={styles.modalContent}
						onPress={(e) => e.stopPropagation()}
					>
						<View style={styles.header}>
							<Text style={styles.title}>Employee Evaluation</Text>
							<TouchableOpacity onPress={onClose} style={styles.closeButton}>
								<Feather name="x" size={24} color="#64748b" />
							</TouchableOpacity>
						</View>

						{children}
					</Pressable>
				</Animated.View>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 20,
		maxHeight: Dimensions.get("window").height,
	},
	modalContent: {
		padding: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		color: "#0f172a",
	},
	closeButton: {
		padding: 4,
	},
	optionsContainer: {
		marginTop: 8,
	},
	option: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	optionLabel: {
		fontSize: 16,
		fontWeight: "500",
		color: "#0f172a",
		marginBottom: 4,
	},
	optionDescription: {
		fontSize: 14,
		color: "#64748b",
	},
	scoreContainer: {
		backgroundColor: "#f1f5f9",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	score: {
		fontSize: 16,
		fontWeight: "600",
		color: "#0f172a",
	},
});
