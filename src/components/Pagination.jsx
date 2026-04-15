import leftArrow from "../assets/left-icon.svg"
import rightArrow from "../assets/right-icon.svg"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-end p-2 font-medium text-secondary">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2"
      >
        <img src={leftArrow} alt="left" className="w-2" />
      </button>

      <span className="flex items-center">
        <p className="bg-background rounded-md py-2 px-4">
          {currentPage}
        </p> 
        <p className="p-2 ">
          of {totalPages}
        </p>
      </span>

      <button
        onClick={() =>
          onPageChange(Math.min(currentPage + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className="p-2"
      >
        <img src={rightArrow} alt="right" className="w-2" />
      </button>
    </div>
  );
};

export default Pagination;