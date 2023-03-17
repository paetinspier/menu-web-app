import React from "react";

interface MenuListProps {
	title: string;
	date: string;
	users: string[];
	mealType: number;
	orders_complete: boolean;
}

const MenuWidget: React.FC<MenuListProps> = (props: MenuListProps) => {
	return (
		<>
			<div className="w-full flex flex-row justify-end items-center rounded-lg bg-emerald-900">

				<div className="w-full duration-300 hover:w-11/12 h-[200px] bg-light rounded-lg p-4 flex flex-col items-center justify-center gap-4">
					<div className="w-full text-dark text-2xl font-medium flex justify-start items-center whitespace-nowrap overflow-hidden">
						{props.title}
					</div>
					<div className="w-full text-dark text-xl font-light flex justify-between items-center">
						{props.date}
                        {props.orders_complete ? (
							<FinishedChip />
						) : (
							<WaitingChip />
						)}
					</div>
					<div className="w-full flex flex-row overflow-hidden justify-start items-center text-dark text-xl font-light">
						{props.users.map((user, index) => {
							if (index == 0) {
								return (
									<div className="text-dark text-xl">
										{user}
									</div>
								);
							} else {
								return (
									<div className="text-dark text-xl">
										, {user}
									</div>
								);
							}
						})}
					</div>
				</div>
			</div>
		</>
	);
};

const WaitingChip = () => {
	return (
		<div className="px-2 py-1 bg-rose-500 text-sm text-light rounded-lg">
			Waiting for orders
		</div>
	);
};

const FinishedChip = () => {
	return (
		<div className="px-2 py-1 bg-emerald-900 text-sm text-light rounded-lg">
			Orders complete
		</div>
	);
};

export default MenuWidget;
