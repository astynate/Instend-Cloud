export const convertFromTimespan = (timeSpan) => {
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
    }
        
    return hours + minutes + seconds;
};

export const convertTicksToTime = (ticks) => {
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
};

export const convertSecondsToTicks = (seconds) => {
    return seconds * 10000000;
};

export const convertTicksToSeconds = (seconds) => {
    return seconds / 10000000;
};

export const formatTimeInSecond = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};