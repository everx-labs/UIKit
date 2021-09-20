import type { LocalizationString } from '@tonlabs/uikit.localization';

interface DataSet {
    lokalise: boolean;
    key: string;
}

export function useLabelDataSet(value: LocalizationString): DataSet {
    return {
        lokalise: true,
        key: value.path,
    };
}
