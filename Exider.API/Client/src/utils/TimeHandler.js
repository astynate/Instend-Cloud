export function displayTime(ticksInSecs) {
    var ticks = ticksInSecs;
    var hh = Math.floor(ticks / 3600);
    var mm = Math.floor((ticks % 3600) / 60);
    var ss = ticks % 60;
    return pad(hh, 2) + ":" + pad(mm, 2) + ":" + pad(ss, 2);
}

export function pad(n, width) {
    var n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

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

    hours = time[0] === '00' ? null : `${minutes[0]}:`;
    minutes = time[1] + ':';
    seconds = time[2].split('.')[0];

    if (hours === null) {
        return minutes + seconds;
    } else {
        return hours + minutes + seconds;
    }
}