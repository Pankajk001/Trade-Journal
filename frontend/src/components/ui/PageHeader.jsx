import { Link } from 'react-router-dom';

const PageHeader = ({ title, buttonText, buttonLink, buttonAction, backLink }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        {backLink && (
          <Link 
            to={backLink}
            className="w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm
                       bg-[#1c1c1c] border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700
                       [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-800 [html:not(.dark)_&]:hover:bg-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
        <h1 className="text-3xl font-bold text-white [html:not(.dark)_&]:text-slate-900">{title}</h1>
      </div>
      
      {buttonText && (
        buttonLink ? (
          <Link
            to={buttonLink}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {buttonText}
          </Link>
        ) : (
          <button
            onClick={buttonAction}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {buttonText}
          </button>
        )
      )}
    </div>
  );
};

export default PageHeader;
