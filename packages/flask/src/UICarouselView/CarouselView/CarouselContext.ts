import { createContext } from 'react';

type CarouselContextType = {
    currentIndex: number;
    setCurrentIndex?: any;
    setPage?: (index: number) => void;
    pages?: React.ReactElement[];
};

export const CarouselContext = createContext<CarouselContextType>({ currentIndex: 0 });
