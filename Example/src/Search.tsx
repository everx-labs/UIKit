import Fuse from 'fuse.js';

export type Section = {
    title: string;
    routeKey: string;
};

export type FuseSearchResult<T> = {
    item: T;
    matches: {
        indices: [number, number][];
        value: string;
        key: string;
        arrayIndex: number;
    }[];
};

export class SectionsService {
    static instance: SectionsService;

    static get shared() {
        if (SectionsService.instance == null) {
            SectionsService.instance = new SectionsService();
        }

        return SectionsService.instance;
    }

    static fuseOptions = {
        shouldSort: true,
        includeMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['title'],
    };

    commands: Section[] = [];

    registerCommand(newCommand: Section) {
        if (
            this.commands.find(({ title }) => {
                return title === newCommand.title;
            }) != null
        ) {
            return;
        }
        this.commands.push(newCommand);
    }

    find(withText: string): Fuse.FuseResultWithMatches<Section>[] {
        const fuse = new Fuse(this.commands, SectionsService.fuseOptions);
        return fuse.search(withText) as any;
    }
}
