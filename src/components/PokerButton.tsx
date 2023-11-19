import React from 'react';

interface PokerButtonProps {
    buttonText: string;
    handleFunc?: (event: React.SyntheticEvent) => void;
    color?: string;
    disabled?: boolean;
}

const PokerButton = ({buttonText, color = "blue", handleFunc, disabled = false}: PokerButtonProps) => {
  switch (color) {
    case "blue":
        if (disabled) {
            return (
                <div className="flex justify-center">
                <button disabled className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-purple-900 to-blue-900 dark:text-stone-600 "
                onClick={handleFunc}>
                    <span className="relative px-5 py-2.5  dark:bg-gray-900 rounded-md ">
                        {buttonText}
                    </span>
                </button>
            </div>
            )
        }
        return (
            <div className="flex justify-center">
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={handleFunc}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        {buttonText}
                    </span>
                </button>
            </div>
          );
    case "red":
        return (
            <div className="flex justify-center">
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-red-500 group-hover:from-purple-600 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                onClick={handleFunc}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        {buttonText}
                    </span>
                </button>
            </div>
          );
    }

};

export default PokerButton;