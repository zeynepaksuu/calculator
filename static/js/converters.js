// Dönüşüm oranları
const conversionRates = {
    volume: {
        liters: 1,
        milliliters: 0.001,
        cubic_meters: 1000,
        cubic_centimeters: 0.001,
        gallons: 3.78541,
        quarts: 0.946353,
        pints: 0.473176,
        cups: 0.236588,
        fluid_ounces: 0.0295735,
        tablespoons: 0.0147868,
        teaspoons: 0.00492892
    },
    length: {
        meters: 1,
        centimeters: 0.01,
        millimeters: 0.001,
        kilometers: 1000,
        inches: 0.0254,
        feet: 0.3048,
        yards: 0.9144,
        miles: 1609.34
    },
    weight: {
        carats: 0.0002,
        milligrams: 0.000001,
        centigrams: 0.00001,
        decigrams: 0.0001,
        grams: 0.001,
        dekagrams: 0.01,
        hectograms: 0.1,
        kilograms: 1,
        metricTons: 1000,
        ounces: 0.0283495,
        pounds: 0.453592,
        stones: 6.35029,
        shortTons: 907.185,
        longTons: 1016.05
    },
    temperature: {
        celsius: {
            celsius: 1,
            fahrenheit: 0.555556,
            kelvin: 1
        },
        fahrenheit: {
            celsius: 0.555556,
            fahrenheit: 1,
            kelvin: 0.555556
        },
        kelvin: {
            celsius: 1,
            fahrenheit: 1.8,
            kelvin: 1
        }
    },
    energy: {
        joules: 1,
        kilojoules: 1000,
        calories: 4.184,
        kilocalories: 4184,
        watt_hours: 3600,
        kilowatt_hours: 3600000,
        electronvolts: 1.602176634e-19,
        britishThermalUnits: 1055.06,
        usThermalUnits: 1055.06,
        footPounds: 1.35582
    },
    region: {
        square_millimeters: 0.000001,
        square_centimeters: 0.0001,
        square_meters: 1,
        hectares: 10000,
        square_kilometers: 1000000,
        square_inches: 0.00064516,
        square_feet: 0.092903,
        square_yards: 0.836127,
        acres: 4046.86,
        square_miles: 2589988.11
    },
    speed: {
        centimeters_per_second: 0.01,
        meters_per_second: 1,
        kilometers_per_hour: 0.277778,
        kilometers_per_second: 1000,
        feet_per_second: 0.3048,
        miles_per_hour: 0.44704,
        knots: 0.514444,
        mach: 340.3
    },
    time: {
        microseconds: 0.000001,
        milliseconds: 0.001,
        seconds: 1,
        minutes: 60,
        hours: 3600,
        days: 86400,
        weeks: 604800,
        years: 31536000
    },
    power: {
        watts: 1,
        kilowatts: 1000,
        horsepower: 745.7,
        foot_pounds_per_minute: 0.022597,
        btu_per_minute: 17.5843
    },
    data: {
        bits: 1,
        nibbles: 4,
        bytes: 8,
        kilobits: 1000,
        kibibits: 1024,
        kilobytes: 8000,
        kibibytes: 8192,
        megabits: 1000000,
        mebibits: 1048576,
        megabytes: 8000000,
        mebibytes: 8388608,
        gigabits: 1000000000,
        gibibits: 1073741824,
        gigabytes: 8000000000,
        gibibytes: 8589934592,
        terabits: 1000000000000,
        tebibits: 1099511627776,
        terabytes: 8000000000000,
        tebibytes: 8796093022208,
        petabits: 1000000000000000,
        pebibits: 1125899906842624,
        petabytes: 8000000000000000,
        pebibytes: 9007199254740992,
        exabits: 1000000000000000000,
        exbibits: 1152921504606846976,
        exabytes: 8000000000000000000,
        exbibytes: 9223372036854775808,
        zettabits: 1000000000000000000000,
        zebibits: 1180591620717411303424,
        zettabytes: 8000000000000000000000,
        zebibytes: 9444732965739290427392,
        yottabits: 1000000000000000000000000,
        yobibits: 1208925819614629174706176,
        yottabytes: 8000000000000000000000000,
        yobibytes: 9671406556917033397649408
    },
    pressure: {
        pascals: 1,
        kilopascals: 1000,
        bars: 100000,
        millimeters_of_mercury: 133.322,
        atmospheres: 101325,
        pounds_per_square_inch: 6894.76
    },
    angle: {
        degrees: 1,
        radians: 180 / Math.PI,
        gradians: 0.9
    }
};

// Döviz çevirici fonksiyonları
async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Fetch error:', error);
        return {};
    }
}

async function globCalculateCurrency(fromCurrency, toCurrency, amount) {
    const rates = await fetchExchangeRates(fromCurrency);
    const conversionRate = rates[toCurrency];


    if (!conversionRate) {
        console.error(`${toCurrency} için dönüşüm oranı bulunamadı.`);
        return null;
    }

    return amount * conversionRate;
}

async function globReverseCalculateCurrency(fromCurrency, toCurrency, amount) {
    const rates = await fetchExchangeRates(fromCurrency);
    const conversionRate = rates[toCurrency];


    if (!conversionRate) {
        console.error(`${toCurrency} için dönüşüm oranı bulunamadı.`);
        return null;
    }

    return amount / conversionRate;
}

// Genel dönüştürücü fonksiyonları
function globGenericCalculate(type, input, fromUnit, toUnit) {
    return (input * conversionRates[type][fromUnit]) / conversionRates[type][toUnit];
}


function globGenericReverseCalculate(type, result, fromUnit, toUnit) {
    return (result * conversionRates[type][toUnit]) / conversionRates[type][fromUnit];
}


// Para birimi sembolleri
const currencySymbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'TRY': '₺',
    'CAD': '$', 'AUD': '$', 'NZD': '$', 'CHF': '₣', 'CNY': '¥', 'INR': '₹'
};

function globUpdateCurrencySymbol(selectedCurrency) {
    return currencySymbols[selectedCurrency] || selectedCurrency;
}