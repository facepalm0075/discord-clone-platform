import { useState, useEffect } from "react";

type UserInfo = {
	userName: string;
	clientId: string;
};

function useLocalStorage(key: string, initialValue: UserInfo | null = null) {
	const [storedValue, setStoredValue] = useState<UserInfo | null>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error("Error reading localStorage key:", key, error);
			return initialValue;
		}
	});

	const setValue = (value: UserInfo | null) => {
		try {
			if (value === null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
			setStoredValue(value);
		} catch (error) {
			console.error("Error setting localStorage key:", key, error);
		}
	};

	useEffect(() => {
		const handleStorageChange = () => {
			try {
				const item = localStorage.getItem(key);
				setStoredValue(item ? JSON.parse(item) : initialValue);
			} catch (error) {
				console.error("Error handling storage change for key:", key, error);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [key, initialValue]);

	return [storedValue, setValue] as const;
}

export default useLocalStorage;
