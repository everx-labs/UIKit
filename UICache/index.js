// @flow
/* eslint-disable no-use-before-define */

import { AsyncStorage } from 'react-native';

/**
 * Cache management.
 *
 * UICache – holds and manages cached value. Responsible for:
 * - fetching actual (remote) value;
 * - persistence of cached value.
 *
 * UICacheObserver – reacts to cache events such as value changing or fetching error.
 */

/**
 * Cache observer.
 * Reacts to cache events such as value changed or fetch error.
 */
export interface UICacheObserver {
    onCacheValueChanged(sender: Object): void;

    onCacheFetchFailed(sender: Object): void;
}

/** Internal – holds atomic updates for UICache properties */
type UICacheStateUpdates<Value> = {
    value?: ?Value,
    isReading?: boolean,
    isFetching?: boolean,
    fetchError?: ?Error,
};

/** Internal – holds information about observer and subscription options. */
type UICacheSubscription = {
    observer: UICacheObserver,
};

/**
 * Cache – holds and manages cached value.
 */
export default class UICache<Value> {
    /**
     * Create cache with specified unique key (usually used to persist cache value).
     */
    constructor(options: { key: string }) {
        this.key = options.key;
        this.subscriptions = [];

        this.value = null;
        this.fetchError = null;
        this.isReading = false;
        this.isFetching = false;
    }

    /** Unique cache key */
    getKey(): string {
        return this.key;
    }

    /** Test if current value is present (loaded in cache from local storage or remote provider) */
    hasValue(): boolean {
        return this.value !== null;
    }

    /** Get current value if present. Otherwise throw error. */
    getValue(): Value {
        if (this.value) {
            return this.value;
        }
        throw new Error('UICache has not a value.');
    }

    /** Test if last fetch have being failed */
    isFetchFailed(): boolean {
        return !!this.fetchError;
    }

    /** Get last fetch error if last fetch have being failed. Otherwise throw error. */
    getFetchError(): Error {
        if (this.fetchError) {
            return this.fetchError;
        }
        throw new Error('UICache has not a fetchError.');
    }

    /** Test if cache is reading value from local (device) storage */
    isReadingLocalValue(): boolean {
        return this.isReading;
    }

    /** Test if cache is fetching actual value */
    isFetchingActualValue(): boolean {
        return this.isFetching;
    }

    /** Test if cache is reading or fetching value */
    isRetrievingValue(): boolean {
        return this.isFetching || this.isReading;
    }

    /**
     * Attach specified observer to cache.
     * If cache has value, observer will be notified immediately.
     * Start refreshing.
     * */
    subscribe(observer: UICacheObserver) {
        this.subscriptions.push({
            observer,
        });
        if (this.hasValue()) {
            observer.onCacheValueChanged(this);
            this.refresh();
        } else if (!this.isRetrievingValue()) {
            this.startReadLocalValue();
        }
    }

    /** Unsubscribe specified observer from cache */
    unsubscribe(observer: UICacheObserver) {
        this.subscriptions = this.subscriptions
            .filter(subscription => subscription.observer !== observer);
    }

    /** Starts fetching of actual value */
    refresh() {
        if (!this.isRetrievingValue()) {
            this.startFetchActualValue();
        }
    }

    // UICache virtual methods

    /** Provide actual value. Usually fetch value from cloud API. */
    // eslint-disable-next-line class-methods-use-this
    async fetchActualValue(): Promise<Value> {
        throw Error('fetchActualValue does not implemented');
    }

    /** Read cached value from device local storage. Defaults read from AsyncStorage. */
    async readLocalValue(): Promise<?Value> {
        const plainValue = JSON.parse(await AsyncStorage.getItem(this.key));
        return this.deserializeValue(plainValue);
    }

    /** Write cached value to device local storage. Defaults write to AsyncStorage. */
    async writeLocalValue(value: Value): Promise<void> {
        const plainValue = this.serializeValue(value);
        return AsyncStorage.setItem(this.key, JSON.stringify(plainValue));
    }

    /** Create serialized representation (plain JSON value), suitable for storing. */
    // eslint-disable-next-line class-methods-use-this
    serializeValue(value: Value): any {
        return value;
    }

    /** Restore value from serialized representation. */
    // eslint-disable-next-line class-methods-use-this
    deserializeValue(plain: any): Value {
        return plain;
    }

    // Internals

    async startReadLocalValue(): Promise<void> {
        this.updateState({ isReading: true });
        const newState: UICacheStateUpdates<Value> = {
            isReading: false,
        };
        try {
            newState.value = await this.readLocalValue();
        } catch (error) {
            console.warn(
                `[UICache] Failed to read value [${this.getKey()}] from local storage with error:`,
                error,
            );
        }
        this.updateState(newState);
        await this.startFetchActualValue();
    }

    async startFetchActualValue(): Promise<void> {
        this.updateState({ isFetching: true });
        try {
            const actualValue = await this.fetchActualValue();
            await this.writeLocalValue(actualValue);
            this.updateState({
                isFetching: false,
                value: actualValue,
                fetchError: null,
            });
        } catch (error) {
            this.updateState({
                isFetching: false,
                fetchError: error,
            });
        }
    }

    updateState(updates: UICacheStateUpdates<Value>) {
        let valueChanged = false;
        let fetchErrorChanged = false;
        if (updates.isReading !== undefined) {
            this.isReading = updates.isReading;
        }
        if (updates.isFetching !== undefined) {
            this.isFetching = updates.isFetching;
        }
        if (updates.value !== undefined) {
            this.value = updates.value;
            valueChanged = true;
        }
        if (updates.fetchError !== undefined) {
            this.fetchError = updates.fetchError;
            fetchErrorChanged = true;
        }
        if (valueChanged) {
            this.subscriptions.forEach((subscription) => {
                subscription.observer.onCacheValueChanged(this);
            });
        }
        if (fetchErrorChanged) {
            if (this.fetchError !== null) {
                this.subscriptions.forEach((subscription) => {
                    subscription.observer.onCacheFetchFailed(this);
                });
            }
        }
    }

    key: string;
    subscriptions: UICacheSubscription[];

    value: ?Value;
    isReading: boolean;
    isFetching: boolean;
    fetchError: ?Error;
}
