export const ConvertDate = (date) => {
    date = new Date(date);
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
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
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        timeZone: 'America/New_York' 
    };
    
    return date.toLocaleString('en-US', options);
};


export const IsDayDiffrent = (previous, current) => {
    previous = new Date(previous);
    current = new Date(current);
    
    return (previous.getDate() - current.getDate()) !== 0;
};

export const ConvertYearMonthOnly = (date) => {
    date = new Date(date);
    
    const options = { 
        year: 'numeric', 
        month: 'long',  
    };
    
    return date.toLocaleString('en-US', options);
};

export const CalculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    };

    return age;
};