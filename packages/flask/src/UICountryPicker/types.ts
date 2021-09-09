import type React from "react";
import type { UIBottomSheetProps } from "../Sheets/UIBottomSheet";

export type Country = {
  code: string,
  name: string,
  emoji: string,
}

export type CountryPickerProps = UIBottomSheetProps & {
  onClose: () => void,
  onSelect?: (countryCode: string) => void,
  permitted?: string[],
  banned?: string[],
}

export type WrapperProps = CountryPickerProps & {
  children: React.FC<CountryPickerProps>
}