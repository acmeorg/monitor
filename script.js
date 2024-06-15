let language = 'bs'; // Initial language is Bosnian

const schedules = {
    weekdays: [
        { time: "04:40", destination: "Zenica", train: "2150", type: "lokalni", platform: "I", track: "1" },
        { time: "06:30", destination: "Banja Luka", train: "712", type: "brzi", platform: "I", track: "1" },
        { time: "07:07", destination: "Čapljina", train: "723", type: "brzi", platform: "II", track: "2" },
        { time: "07:14", destination: "Zenica", train: "2152", type: "lokalni", platform: "II", track: "3" },
        { time: "10:56", destination: "Zenica", train: "2154", type: "lokalni", platform: "II", track: "3" },
        { time: "16:00", destination: "Bihać", train: "714", type: "brzi", platform: "I", track: "1" },
        { time: "16:07", destination: "Konjic", train: "2401", type: "lokalni", platform: "II", track: "2" },
        { time: "16:13", destination: "Kakanj", train: "2156", type: "lokalni", platform: "II", track: "3" },
        { time: "16:50", destination: "Čapljina", train: "721", type: "brzi", platform: "I", track: "1" },
        { time: "19:20", destination: "Zenica", train: "2158", type: "lokalni", platform: "II", track: "3" }
    ],
    weekends: [
        { time: "04:41", destination: "Zenica", train: "2150", type: "lokalni", platform: "I", track: "1" },
        { time: "05:23", destination: "Visoko", train: "2160", type: "prigradski", platform: "II", track: "3" },
        { time: "07:26", destination: "Pazarić", train: "2403", type: "prigradski", platform: "I", track: "1" },
        { time: "10:21", destination: "Visoko", train: "2164", type: "prigradski", platform: "II", track: "3" },
        { time: "11:55", destination: "Pazarić", train: "2407", type: "prigradski", platform: "I", track: "1" },
        { time: "15:38", destination: "Zenica", train: "2156", type: "lokalni", platform: "II", track: "3" },
        { time: "16:30", destination: "Maglaj", train: "710", type: "brzi", platform: "I", track: "1" },
        { time: "16:46", destination: "Čapljina", train: "721", type: "brzi", platform: "II", track: "3" },
        { time: "19:31", destination: "Pazarić", train: "2413", type: "prigradski", platform: "I", track: "1" }
    ]
};

function getCurrentCETTime() {
    const now = new Date();
    const cetTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Berlin', // CET/CEST
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(now).split(':');
    return {
        hours: parseInt(cetTime[0], 10),
        minutes: parseInt(cetTime[1], 10)
    };
}

function updateCurrentTime() {
    const cetTime = getCurrentCETTime();
    const hours = String(cetTime.hours).padStart(2, '0');
    const minutes = String(cetTime.minutes).padStart(2, '0');
    const currentTimeElement = document.getElementById('current-time');
    currentTimeElement.textContent = `${hours}:${minutes}`;
}

function updateDepartures() {
    const cetTime = getCurrentCETTime();
    const currentHour = cetTime.hours;
    const currentMinute = cetTime.minutes;
    const departuresList = document.getElementById('departures-list');

    // Determine if it's a weekday or weekend
    const currentDay = new Date().getDay();
    const currentSchedule = currentDay === 0 || currentDay === 6 ? schedules.weekends : schedules.weekdays;

    // Clear existing list items
    departuresList.innerHTML = '';

    // Filter and sort departures based on current time
    let upcomingDepartures = currentSchedule
        .filter(departure => {
            const [departureHour, departureMinute] = departure.time.split(':').map(Number);
            return (departureHour > currentHour) || (departureHour === currentHour && departureMinute >= currentMinute);
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    // If no departures are left for the day, show the next day's schedule
    if (upcomingDepartures.length === 0) {
        const nextSchedule = currentDay === 5 ? schedules.weekends : schedules.weekdays;
        upcomingDepartures = nextSchedule.sort((a, b) => a.time.localeCompare(b.time));
    }

    displayDepartures(upcomingDepartures, currentHour, currentMinute);

    // Update every minute
    setTimeout(updateDepartures, 60000);
    setTimeout(updateCurrentTime, 60000);
}

function displayDepartures(upcomingDepartures, currentHour, currentMinute) {
    const departuresList = document.getElementById('departures-list');

    // Only show the next 9 departures
    upcomingDepartures.slice(0, 9).forEach(departure => {
        const [departureHour, departureMinute] = departure.time.split(':').map(Number);
        const isWithinNextHour = departureHour === currentHour || (departureHour === (currentHour + 1) % 24 && departureMinute <= currentMinute);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${isWithinNextHour ? '<span class="dot"></span>' : ''}</td>
            <td>${departure.time}</td>
            <td>${departure.destination}</td>
            <td>${departure.train}</td>
            <td class="train-type">${departure.type}</td>
            <td>${departure.platform}/${departure.track}</td>
        `;
        departuresList.appendChild(row);
    });
}

// Function to toggle language
function toggleLanguage() {
    const headerTitle = document.getElementById('header-title');
    const timeHeader = document.getElementById('time-header');
    const destinationHeader = document.getElementById('destination-header');
    const trainHeader = document.getElementById('train-header');
    const platformTrackHeader = document.getElementById('platform-track-header');
    const trainTypes = document.querySelectorAll('.train-type');

    if (language === 'bs') {
        language = 'en';
        headerTitle.textContent = 'DEPARTURE';
        timeHeader.textContent = 'TIME';
        destinationHeader.textContent = 'DESTINATION';
        trainHeader.textContent = 'TRAIN';
        platformTrackHeader.textContent = 'PLATFORM/TRACK';

        trainTypes.forEach(type => {
            if (type.textContent === 'brzi') {
                type.textContent = 'express';
            } else if (type.textContent === 'lokalni') {
                type.textContent = 'regional';
            } else if (type.textContent === 'prigradski') {
                type.textContent = 'commuter';
            }
        });
    } else {
        language = 'bs';
        headerTitle.textContent = 'ODLAZAK';
        timeHeader.textContent = 'SATI';
        destinationHeader.textContent = 'SMJER';
        trainHeader.textContent = 'VOZ';
        platformTrackHeader.textContent = 'PERON/KOL';

        trainTypes.forEach(type => {
            if (type.textContent === 'express') {
                type.textContent = 'brzi';
            } else if (type.textContent === 'regional') {
                type.textContent = 'lokalni';
            } else if (type.textContent === 'commuter') {
                type.textContent = 'prigradski';
            }
        });
    }
}

// Function to toggle dot color
function toggleDotColor() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.classList.toggle('bright');
    });
}

// Initial updates
updateDepartures();
updateCurrentTime();

// Toggle language every 10 seconds
setInterval(toggleLanguage, 10000);

// Toggle dot color every second
setInterval(toggleDotColor, 1000);
