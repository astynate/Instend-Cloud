export const ConvertDate = (date) => {
    date = new Date(date);
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
    };
    
    return date.toLocaleString('en-US', options);
};

export const ConvertDateToTime = (date) => {
    date = new Date(date);
    
    const options = { 
        hour: 'numeric', 
        minute: 'numeric', 
    };
    
    return date.toLocaleString('en-US', options);
};

export const ConvertFullDate = (date) => {
    date = new Date(date);
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        timeZone: 'America/New_York' 
    };
    
    return date.toLocaleString('en-US', options);
};