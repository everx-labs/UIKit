import React from "react"
import { View, StyleSheet } from "react-native"

import { UIConstant } from "@tonlabs/uikit.core";
import { TouchableOpacity, UIBackgroundView, UIBackgroundViewColors} from '@tonlabs/uikit.hydrogen';

const circleSize = 6;

type CircleProps = { active: boolean; onPress: (event: any) => void };

const Circle: React.FC<CircleProps> = React.memo(({ active, onPress }: CircleProps) => {
    
    const color = React.useMemo(()=>{
        return active
                ? UIBackgroundViewColors.BackgroundAccent
                : UIBackgroundViewColors.BackgroundNeutral
    }, [active])

    return (
        <TouchableOpacity
            hitSlop={{
                top: 8,
                left: 8,
                right: 8,
                bottom: 8,
            }}
            onPress={onPress}
            style={{alignItems: 'center'}}
        >
            <UIBackgroundView
                color={color}
                style={styles.circle}
            />
        </TouchableOpacity>
    );
});

function getPaginationWidth(amount: number) {
    return UIConstant.contentOffset() + amount * (circleSize + UIConstant.contentOffset());
}

type PaginationProps = {
    pages: React.ReactElement[];
    setPage: (index: number) => void;
    activeIndex: number;
}

export const Pagination: React.FC<PaginationProps> = React.memo(({pages, setPage, activeIndex}: PaginationProps ) => {

    const onHandlePress = React.useCallback((index: number)=>{
        setPage(index)
    },[setPage])

    return (
        <View style={[{width: getPaginationWidth(pages.length)}, styles.pagination]}>
            {pages.map((_, index) => {
                    return (
                        <Circle
                            // eslint-disable-next-line react/no-array-index-key
                            key={`Circles_${index}`}
                            active={index === activeIndex}
                            onPress={() => onHandlePress(index)}
                        />)
                    })}
        </View>
    )
})

const styles = StyleSheet.create({
    circle: {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
    },
    pagination: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignSelf: 'center', 
    }
  });
