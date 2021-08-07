import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./index.css";
const BreadCrumb = () => {
  const location = useLocation();
  const breadCrumbView = () => {
    const { pathname } = location;
    // console.log(`pathname is ${pathname}`);
    const getPathNames = (names) => {
      const pathNames = names.split("/").filter((item) => {
        // console.log(`item is ${item}`);
        if (item.length > 20) {
          return false;
        }
        return item;
      });
      return pathNames;
    };
    // const pathnames = pathname.split("/").filter((item) => item);
    const pathnames = getPathNames(pathname);
    // console.log(pathnames);
    const capatilize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return (
      <div className='bcrumb'>
        <div>
          {pathnames.length > 0 ? (
            <span>
              <Link to='/'>Home</Link>
            </span>
          ) : (
            <span></span>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <span key={index}>{capatilize(name)}</span>
            ) : (
              <span key={index}>
                <Link to={`${routeTo}`}>{capatilize(name)}</Link>
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return <>{breadCrumbView()}</>;
};

export default BreadCrumb;
