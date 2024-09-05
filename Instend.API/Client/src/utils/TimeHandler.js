export function convertFromTimespan(timeSpan) {
    if (timeSpan === '' || timeSpan === null || timeSpan === undefined) {
        return null;
    }

    const time = timeSpan.split(':');
    let hours = null;
    let minutes = null;
    let seconds = null;

    if (!time.length || time.length < 3) {
        return null;
    }

    hours = time[0] === '00' ? null : `${time[0]}:`;
    minutes = time[1] + ':';
    seconds = time[2].split('.')[0];

    if (hours === null) {
        return minutes + seconds;
    } else {
        return hours + minutes + seconds;
    }
}

export function convertTicksToTime(ticks) {
    let hours = null;
    let milliseconds = ticks / 10000;
    let minutes = Math.floor(milliseconds / 60000);

    milliseconds = milliseconds % 60000;
    
    let seconds = Math.floor(milliseconds / 1000);

    if (minutes > 60) {
        hours =  Math.floor(minutes / 60);
        minutes = Math.floor(minutes % 60);
    }

    const formatString = (value) => {
        return value ? (value < 10 ? "0" : "") + value : "00";
    }

    let time = (hours ? formatString(hours) + ':' : "") + formatString(minutes) + ":" + formatString(seconds);

    return time;
}

export function convertSecondsToTicks(seconds) {
    return seconds * 10000000;
}

export function convertTicksToSeconds(seconds) {
    return seconds / 10000000;
}