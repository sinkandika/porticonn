const taskProgressBar = ({ value }) => {
  return (
    <div className="bg-background rounded-full h-4 w-full">
      <div
        className="bg-third h-4 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default taskProgressBar;