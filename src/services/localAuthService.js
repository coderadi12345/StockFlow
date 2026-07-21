import { STORAGE_KEYS } from '../constants';

const readUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(users));
};

export const localAuthService = {
  register: ({
    username,
    password,
    firstName = '',
    lastName = '',
    email = '',
  }) => {
    const trimmedUsername = username.trim();
    const normalized = trimmedUsername.toLowerCase();

    if (!normalized) {
      throw new Error('Username is required');
    }

    const users = readUsers();
    if (users.some((user) => user.username.toLowerCase() === normalized)) {
      throw new Error('Username already taken');
    }

    const user = {
      id: crypto.randomUUID(),
      username: trimmedUsername,
      password,
      firstName: firstName.trim() || trimmedUsername,
      lastName: lastName.trim(),
      email: email.trim(),
      createdAt: Date.now(),
    };

    users.push(user);
    writeUsers(users);
    return user;
  },

  login: (username, password) => {
    const normalized = username.trim().toLowerCase();
    const user = readUsers().find(
      (entry) =>
        entry.username.toLowerCase() === normalized && entry.password === password
    );

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: `local_${user.id}`,
    };
  },
};
