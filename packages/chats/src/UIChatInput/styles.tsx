import { StykeSheet } from "react-native";

const commonStyles = StyleSheet.create({
    buttonContainer: {
        padding: UIConstant.contentOffset(),
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end",
        height: UIConstant.largeButtonHeight(),
    },
    icon: {
        height: UIConstant.iconSize(),
        width: UIConstant.iconSize(),
    },
});
