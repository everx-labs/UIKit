import '@testing-library/jest-native/extend-expect';

import { render } from '@testing-library/react-native';
import { UIButton } from '../src/UIButton/index'



test('should render correctly', () => {
    const { getByTestId } = render(
            <UIButton disabled testID="button" title="submit" onPress={(e) => e} />
      );
      expect(getByTestId('button')).toBeDisabled();
});

