import { useEffect, useRef, useState } from "react"



const ProjectDropdown = ({
	label, 
	options, 
	icon, 
	iconClassName, 
	menuClassName
}) => {
	const [isOpen, setIsOpen]= useState(false);
	const dropClose = useRef(null);

	// dropdown
	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	// dropdown auto close
	useEffect (() => {
		const handleClickOutside = (event) => {
			if (dropClose.current && !dropClose.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen]);

	return(
		<div 
		ref={dropClose}
		className="relative" 
		>
			<button 
			onClick={toggleDropdown}
			className="hover:text-primary-h flex gap-2"
			>
				<p>{label}</p>
				<img 
				src={icon} 
				alt="drop" 
				className={iconClassName}
				/>
			</button>

			{isOpen && (
				<div className={menuClassName || "absolute bg-white rounded-md p-2 right-0 text-center shadow text-primary w-40"}>
					{options.map((opt, idx) => (
						<button 
						key={idx} 
						onClick={opt.onClick}
						className="p-3 rounded-md hover:bg-hover w-full"
						>
							{opt.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
export default ProjectDropdown;