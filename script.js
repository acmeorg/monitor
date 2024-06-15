let language = 'bs'; // Initial language is Bosnian

const schedules = {
    weekdays: [
        { time: "04:44", destination: "Zenica", train: "2150", type: "lokalni", platform: "I", track: "1" },
        { time: "05:26", destination: "Visoko", train: "2160", type: "prigradski", platform: "II", track: "3" },
        { time: "07:15", destination: "Čapljina", train: "723", type: "brzi", platform: "II", track: "2" },        
        { time: "07:26", destination: "Pazarić", train: "2403", type: "prigradski", platform: "I", track: "1" },
        { time: "08:17", destination: "Visoko", train: "2162", type: "prigradski", platform: "II", track: "3" },
        { time: "09:58", destination: "Pazarić", train: "2405", type: "prigradski", platform: "II", track: "2" },
        { time: "11:55", destination: "Pazarić", train: "2407", type: "prigradski", platform: "I", track: "1" },
        { time: "14:30", destination: "Pazarić", train: "2409", type: "prigradski", platform: "I", track: "1" },
        { time: "15:41", destination: "Zenica", train: "2156", type: "lokalni", platform: "II", track: "3" },
        { time: "16:30", destination: "Maglaj", train: "710", type: "brzi", platform: "I", track: "1" },
        { time: "16:46", destination: "Čapljina", train: "721", type: "brzi", platform: "II", track: "3" },
        { time: "16:55", destination: "Pazarić", train: "2411", type: "prigradski", platform: "I", track: "1" },
        { time: "17:25", destination: "Visoko", train: "2168", type: "prigradski", platform: "II", track: "3" },
        { time: "19:32", destination: "Visoko", train: "2168", type: "prigradski", platform: "II", track: "3" },
        { time: "19:41", destination: "Pazarić", train: "2413", type: "prigradski", platform: "I", track: "1" }
    ],
    weekends: [
        { time: "04:44", destination: "Zenica", train: "2150", type: "lokalni", platform: "I", track: "1" },
        { time: "05:26", destination: "Visoko", train: "2160", type: "prigradski", platform: "II", track: "3" },
        { time: "07:15", destination: "Čapljina", train: "723", type: "brzi", platform: "II", track: "2" },        
        { time: "07:26", destination: "Pazarić", train: "2403", type: "prigradski", platform: "I", track: "1" },
        { time: "11:55", destination: "Pazarić", train: "2407", type: "prigradski", platform: "I", track: "1" },
        { time: "15:41", destination: "Zenica", train: "2156", type: "lokalni", platform: "II", track: "3" },
        { time: "16:30", destination: "Maglaj", train: "710", type: "brzi", platform: "I", track: "1" },
        { time: "16:46", destination: "Čapljina", train: "721", type: "brzi", platform: "II", track: "3" },
        { time: "19:41", destination: "Pazarić", train: "2413", type: "prigradski", platform: "I", track: "1" }
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

// Toggle dot color every second
setInterval(toggleDotColor, 1000);
