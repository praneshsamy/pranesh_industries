/**
 * Utility for mapping city/common names to official GeoJSON district names.
 * This ensures that business activity is correctly highlighted even if the
 * source data uses common city names.
 */

const CITY_TO_DISTRICT = {
    // Karnataka
    'BANGALORE': 'Bangalore Urban',
    'BENGALURU': 'Bangalore Urban',
    'MYSORE': 'Mysore',
    'MYSURU': 'Mysore',

    // Maharashtra
    'MUMBAI': 'Greater Bombay',
    'BOMBAY': 'Greater Bombay',
    'PUNE': 'Pune',

    // Andhra Pradesh
    'VISAKHAPATNAM': 'Vishakhapatnam',
    'VIZAG': 'Vishakhapatnam',
    'VIJAYAWADA': 'Krishna',
    'VIJAYVADA': 'Krishna',

    // Tamil Nadu
    'CHENNAI': 'Chennai',
    'MADRAS': 'Chennai',
    'COIMBATORE': 'Coimbatore',
    'KOVAI': 'Coimbatore',

    // Telangana (represented in AP GeoJSON)
    'HYDERABAD': 'Hyderabad',
};

/**
 * Normalizes a region name for consistent matching.
 */
export const normalizeName = (name) => {
    if (!name) return '';
    return name.trim().toUpperCase();
};

/**
 * Matches a data name (from customers.json) to a GeoJSON district name.
 */
export const isDistrictMatch = (dataName, geoName) => {
    if (!dataName || !geoName) return false;
    const dName = normalizeName(dataName);
    const gName = normalizeName(geoName);

    if (dName === gName) return true;

    // Check mapping table (Data -> Geo)
    if (CITY_TO_DISTRICT[dName] && normalizeName(CITY_TO_DISTRICT[dName]) === gName) {
        return true;
    }

    // Reverse mapping check (Geo -> Data)
    for (const [key, value] of Object.entries(CITY_TO_DISTRICT)) {
        if (normalizeName(value) === gName && key === dName) {
            return true;
        }
    }

    // Fuzzy matching for common suffixes
    const gNameClean = gName.replace(' URBAN', '').replace(' RURAL', '').replace(' CITY', '').replace(' DISTRICT', '').replace(' CORPORATION', '');
    const dNameClean = dName.replace(' URBAN', '').replace(' RURAL', '').replace(' CITY', '').replace(' DISTRICT', '').replace(' CORPORATION', '');

    if (dNameClean === gNameClean) return true;
    if (gNameClean.includes(dNameClean) || dNameClean.includes(gNameClean)) return true;

    return false;
};

/**
 * Gets the display name for a district, mapping back to common names if preferred.
 */
export const getDisplayName = (geoName) => {
    // Reverse lookup for display if needed, but usually GeoJSON names are fine
    return geoName;
};
