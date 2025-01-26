class SortingHandler {
    static CompareTwoDates = (a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        
        return dateB - dateA;
    };
};

export default SortingHandler;