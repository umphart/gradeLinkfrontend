export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const truncate = (str, length = 50) => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };
  
  export const getInitials = (name) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };