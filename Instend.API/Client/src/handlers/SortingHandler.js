class SortingHandler {
    static CompareTwoDates = (a, b, isAscending = false) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        
        return isAscending ? dateB - dateA : dateA - dateB;
    };
};

export default SortingHandler;