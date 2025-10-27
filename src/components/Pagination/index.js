import axios from "axios";
import React, { useEffect } from "react";
import { Placeholder } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

const Pagination = ({
  dataProps,
  setDataProps,
  setShowLoading,
  isLoading,
  params,
}) => {
  const dispatch = useDispatch();

  const nextPagination = (e, url, keyword) => {
    e.preventDefault();
    dispatch(setShowLoading(true));
    axios({
      url: url,
      method: "GET",
      params: { ...params },
    }).then(
      (response) => {
        dispatch(setDataProps(response.data));
        dispatch(setShowLoading(false));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const previousPagination = (e, url, keyword) => {
    e.preventDefault();
    dispatch(setShowLoading(true));
    axios({
      url: url,
      method: "GET",
      params: { ...params },
    }).then(
      (response) => {
        dispatch(setDataProps(response.data));
        dispatch(setShowLoading(false));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const skipToPage = (e, page, keyword) => {
    e.preventDefault();
    dispatch(setShowLoading(true));
    const path = dataProps.path;
    var url = path + "?";
    url += "page=" + page;
    axios({
      url: url,
      method: "GET",
      params: { ...params },
    }).then(
      (response) => {
        dispatch(setDataProps(response.data));
        dispatch(setShowLoading(false));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div>
      {isLoading ? (
        <div className="col s2">
          <i>
            <font size={1}>
              <Placeholder animation="glow">
                <Placeholder lg={1} />
              </Placeholder>
            </font>
          </i>
        </div>
      ) : (
        dataProps && (
          <div className="col s2">
            <i>
              <font size={1}>
                <span>
                  Showing records{" "}
                  {dataProps.from || dataProps.to
                    ? `${dataProps.from}-${dataProps.to}`
                    : "0 "}
                  out of {dataProps.total}
                </span>
              </font>
            </i>
          </div>
        )
      )}
      {isLoading ? (
        <Placeholder animation="glow">
          <Placeholder lg={1} />
        </Placeholder>
      ) : (
        <ul className="pagination pagination-sm m-0 float-left">
          {/* Pag previous sa page  */}
          {/* <li style={{cursor:"not-allowed",pointerEvents:"all"}} className="page-item disabled"><a className="page-link" href="/#">&laquo;</a></li> */}
          {/* <li className="page-item"><a className="page-link" href="/#">&laquo;</a></li> */}

          {dataProps &&
            (dataProps.current_page === 1 ? (
              <li
                style={{ cursor: "not-allowed", pointerEvents: "all" }}
                className="page-item disabled"
              >
                <a className="page-link" href="/#">
                  &laquo;
                </a>
              </li>
            ) : (
              <li
                onClick={(e) =>
                  previousPagination(e, dataProps.prev_page_url, "empty")
                }
                className="page-item"
              >
                <a className="page-link" href="/#">
                  &laquo;
                </a>
              </li>
            ))}

          {/* Pag adto sa first page */}

          {dataProps &&
            (dataProps.current_page === 1 ||
            dataProps.current_page === 2 ||
            dataProps.current_page === 3 ||
            (dataProps.last_page > 3 && dataProps.last_page < 6) ? (
              ""
            ) : (
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={(e) => skipToPage(e, 1, "empty")}
                  href="/#"
                >
                  1
                </a>
              </li>
            ))}

          {/* Mag add ug (...) if ang current page is 4 pataas */}
          {dataProps &&
            (dataProps.current_page === 1 ||
            dataProps.current_page === 2 ||
            dataProps.current_page === 3 ||
            (dataProps.last_page > 3 && dataProps.last_page < 6) ? (
              ""
            ) : (
              <li className="page-item disabled">
                <a className="page-link" href="/#">
                  ...
                </a>
              </li>
            ))}

          {/* Number of Pages */}
          {dataProps &&
            [...Array(dataProps.last_page)].map(function (key, index) {
              return (dataProps.current_page + 1 < index && index > 4) ||
                (dataProps.current_page - 3 > index &&
                  index < dataProps.last_page - 5) ? (
                ""
              ) : index + 1 === dataProps.current_page ? (
                <li className="page-item active" key={index}>
                  <a
                    className="page-link"
                    onClick={(e) => skipToPage(e, index + 1, "empty")}
                    href="/#"
                  >
                    {index + 1}
                  </a>
                </li>
              ) : (
                <li className="page-item" key={index}>
                  <a
                    className="page-link"
                    onClick={(e) => skipToPage(e, index + 1, "empty")}
                    href="/#"
                  >
                    {index + 1}
                  </a>
                </li>
              );

              // <li className="page-item active">
              //     <a className="page-link" onClick={(e) => skipToPage(e, index, 'empty')} href="/#">{index}</a>
              // </li>
            })}

          {/* Pag add ug (...) */}
          {dataProps &&
            (dataProps.current_page === dataProps.last_page ||
            dataProps.current_page === dataProps.last_page - 1 ||
            dataProps.current_page === dataProps.last_page - 2 ||
            (dataProps.last_page > 3 && dataProps.last_page < 6) ? (
              ""
            ) : (
              <li className="page-item disabled">
                <a className="page-link" href="/#">
                  ...
                </a>
              </li>
            ))}

          {/* Pag adto sa last page last page */}

          {dataProps &&
            (dataProps.current_page === dataProps.last_page ||
            dataProps.current_page === dataProps.last_page - 1 ||
            dataProps.current_page === dataProps.last_page - 2 ||
            (dataProps.last_page > 3 && dataProps.last_page < 6) ? (
              ""
            ) : (
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={(e) => skipToPage(e, dataProps.last_page, "empty")}
                  href="/#"
                >
                  {dataProps.last_page}
                </a>
              </li>
            ))}

          {/* Pag Next sa Pages */}
          {dataProps &&
            (dataProps.current_page === dataProps.last_page ? (
              <li
                style={{ cursor: "not-allowed", pointerEvents: "all" }}
                className="page-item disabled"
              >
                <a className="page-link" href="/#">
                  &raquo;
                </a>
              </li>
            ) : (
              <li
                onClick={(e) =>
                  nextPagination(e, dataProps.next_page_url, "empty")
                }
                className="page-item"
              >
                <a className="page-link" href="/#">
                  &raquo;
                </a>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Pagination;
