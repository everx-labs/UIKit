import React from "react";
import { Dimensions } from "react-native";
import { UIBottomSheet } from "@tonlabs/uikit.navigation";
import type { CountryPickerProps, WrapperProps } from "../types";

export function CountryPickerWrapper(props: WrapperProps) {

    const CountryPicker: React.FC<CountryPickerProps> = props.children;

    return(
        <UIBottomSheet 
            onClose={props.onClose} 
            visible={props.visible}
            style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                height: Dimensions.get('window').height,
            }}>
            <CountryPicker 
                {...props}
                />
        </UIBottomSheet>
    )
}