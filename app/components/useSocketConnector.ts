import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io, { Socket } from "socket.io-client";
import { setRooms } from "../redux/slices/mainStatusSlice";

export const useSocketConnector = (url: string) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const dispatch = useDispatch();

	const socketConnect = () => {
		setSocket(io(url));
	};

	useEffect(() => {
		fetch("https://discord-server.pouyaprogramming.ir/get-rooms", {
			method: "GET",
		}).then((data) => {
			data.json().then((d) => {
				const jsonData = JSON.parse(d);
				dispatch(setRooms(jsonData.message));
			});
		});
	}, [socket]);

	return { socket, socketConnect };
};
