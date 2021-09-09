export type Country = {
  code: string,
  name: string,
  emoji: string,
}

export type CountryPickerProps = {
  onClose: () => void,
  onSelect?: (countryCode: string) => void,
  permitted?: string[],
  banned?: string[],
}

export type WrappedCountryPickerProps = CountryPickerProps & {
  visible: boolean,
}
