export const ByDate = (a, b, isAcendng) => {
  const dateA = new Date(a.creationTime);
  const dateB = new Date(b.creationTime);
  
  return isAcendng ? dateA - dateB : dateB - dateA;
}

export const ByName = (a, b, isAcendng) => {
  if (isAcendng) {
      if (a.name < b.name) {
          return -1;
      } else if (a.name > b.name) {
          return 1;
      }
  } else {
      if (a.name > b.name) {
          return -1;
      } else if (a.name < b.name) {
          return 1;
      }
  }
  return 0;
}