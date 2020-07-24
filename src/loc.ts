//Location
import {
    dispatch,
    EVENT_LOCATION_CHANGE,
    EVENT_LOCATION_ERROR,
    EVENT_REQUEST_LOCATION_SUCCESS,
    EVENT_REQUEST_LOCATION_ERROR
} from './event';

let instance: AbstractLocationPlatform | null = null;

/**
 * Set the LocationPlatform instance for this application. The instance can only be set once and should be initialized by the platform.
 * @param inst Location platform that implements the AbstractLocationPlatform
 */
export function setInstance(inst: AbstractLocationPlatform): void {
    if (instance === null) {
        if (!(inst instanceof AbstractLocationPlatform)) {
            throw new TypeError('Instance must implement AbstractLocationPlatform class.');
        }

        instance = inst;
    } else {
        throw new Error('LocationPlatform instance can only be set once.');
    }
}

/**
 * Get the current location platform instance. It can be null if it has not been initialized by the platform yet.
 */
export function getInstance(): AbstractLocationPlatform | null {
    return instance;
}

/**
 * Specifies the latitude and longitude coordinates of the location
 */
export class LocationPos {

    private lat: number;

    private lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    getLat(): number {
        return this.lat;
    }

    getLng(): number {
        return this.lng;
    }
}

/**
 * Specifies the error code and message of the occurred location error
 */
export class LocationError {

    PERMISSION_DENIED = 1;

    POSITION_UNAVAILABLE = 2;

    TIMED_OUT = 3;

    NOT_SUPPORTED = 4;

    private code: number;

    private msg: string;

    constructor(code: number, msg: string) {
        this.code = code;
        this.msg = msg;
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.msg;
    }

}

/**
 *  Location platform that handles device location in the application. Location access is platform-dependent.
 */
export abstract class AbstractLocationPlatform {

    private currLoc: LocationPos | null = null;

    private locError: LocationError | null = null;

    private locTime: number = -1;

    /**
     * Returns whether the current platform supports location
     */
    abstract isLocationSupported(): boolean;

    /**
     * Requests location access permission natively and returns a promise which should resolve a LocationPos, otherwise a null.
     * This method does not involve event systems and runs directly according the platform's implementation.
     */
    protected abstract nativeRequestLocationAccess(): Promise<LocationPos|null>;

    /**
     * Requests location access and returns a promise which should resolve a LocationPos, otherwise a null.
     */
    requestLocationAccess(): Promise<LocationPos|null> {
        return this.nativeRequestLocationAccess()
            .then((loc) => {
                this.reportRequestLocationSuccess();
                if (loc !== null) {
                    this.currLoc = loc;
                    this.reportLocationChange(loc);
                }
                return loc;
            })
            .catch((err) => {
                this.locError = err;
                this.reportRequestLocationError(err);
                return Promise.reject(err);
            });
    }

    /**
     * Reports a location change to the event system
     * @param loc LocationPos, cannot be null
     */
    protected reportLocationChange(loc: LocationPos): void {
        if (loc === null || !(loc instanceof LocationPos)) {
            throw new TypeError("Location cannot be null and must be a LocationPos");
        }
        this.currLoc = loc;
        this.locTime = Date.now();
        dispatch(EVENT_LOCATION_CHANGE, loc);
    }

    /**
     * Reports a location error to the event system
     * @param err LocationError, cannot be null
     */
    protected reportLocationError(err: LocationError): void {
        if (err === null || !(err instanceof LocationError)) {
            throw new TypeError("Error cannot be null and must be a LocationError");
        }
        this.locError = err;
        dispatch(EVENT_LOCATION_ERROR, err);
    }

    /**
     * Reports location access request success to the event system
     */
    protected reportRequestLocationSuccess(): void {
        dispatch(EVENT_REQUEST_LOCATION_SUCCESS);
    }

    /**
     * Reports location access request error to the event system
     * @param err LocationError, cannot be null
     */
    protected reportRequestLocationError(err: LocationError): void {
        if (err === null || !(err instanceof LocationError)) {
            throw new TypeError("Error cannot be null and must be a LocationError");
        }
        this.locError = err;
        dispatch(EVENT_REQUEST_LOCATION_ERROR, err);
    }

    /**
     * Returns the last located position. It returns null if no position is located
     */
    getCurrentLocation(): LocationPos | null {
        return this.currLoc;
    }

    /**
     * Returns the last located time. It returns -1 if no position is located 
     */
    getLastLocatedTime(): number {
        return this.locTime;
    }

    /**
     * Returns whether it is located
     */
    isLocated(): boolean {
        return this.currLoc !== null;
    }

    /**
     * Returns the last location error recorded
     */
    getLocationError(): LocationError | null {
        return this.locError;
    }

    /**
     * Returns whether there is any errors
     */
    isErrored(): boolean {
        return this.locError !== null;
    }

}