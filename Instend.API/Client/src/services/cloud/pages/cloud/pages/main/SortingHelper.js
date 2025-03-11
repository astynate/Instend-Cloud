export const sortItems = (a, b, sortingType) => {
    let comparison = 0;

    if (sortingType === 0) {
        const dateA = new Date(a.creationTime);
        const dateB = new Date(b.creationTime);
        comparison = dateB - dateA;
    } else if (sortingType === 1) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        comparison = nameB.localeCompare(nameA);
    };

    return comparison;
};