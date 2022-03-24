import type { StyleProp, ViewStyle } from 'react-native';

export type UISkeletonProps = {
    /**
     * Flag to control skeleton visibility during loading, i.e.
     *
     * ```ts
     * const [isLoading, setIsLoading] = React.useState(true);
     * <Skeleton show={isLoading}>
     *   <UIImage source={...} onLoadEnd={() => setIsLoading(false)} />
     * </Skeleton>
     * ```
     */
    show: boolean;
    /**
     * You can use the `Skeleton` in two ways depending on your layout:
     *
     * 1. The edges of the `children`'s layout are the SAME as the `Skeleton` layout:
     *
     *    You're lucky. You can use the `Skeleton` as a container for your content.
     *    Your content will be wrapped with a View, so you will probably want to give some
     *    dimensions to your content or provide some default value for a text,
     *    that will be approximately of the same size as the real content
     *
     *    ```ts
     *        <Skeleton show={loading}>
     *            <YourContent />
     *        </Skeleton>
     *    ```
     *
     * 2. The edges of the `children`'s layout do NOT MATCH the `Skeleton` layout:
     *
     *    You need to use the `Skeleton` as a separate component.
     *    You will have to set a style that defines the dimensions of the `Skeleton`.
     *    It is no necessary to pass `children`.
     *
     *    ```ts
     *        <View>
     *            {loading ? <Skeleton show style={contentSize} /> : <YourContent /> }
     *        </View>
     *    ```
     */
    children?: React.ReactNode;
    /**
     * The `Skeleton` behaves like a usual `View` container and accepts all the appropriate styles
     */
    style?: StyleProp<ViewStyle>;
};
