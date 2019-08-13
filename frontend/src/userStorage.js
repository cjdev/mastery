const key = 'user';

export const saveUser = user => {
  try {
    localStorage.setItem(key, JSON.stringify(user));
  } catch (e) {
    console.log(e);
  }
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(key);
};
