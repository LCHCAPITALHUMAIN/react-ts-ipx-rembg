/*import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home, RemoveBackground, Users } from "./page/";
import axios from "axios";
import "./styles.css";
import { ResponseAPI } from "./api";
import { createPost } from "./utils";
import Modal from "./page/Modal";
const data = {
  name: " Text context react router v6",
  onClick: () => {
    console.log("this event onclick from context");
  }
};

export const ContextData = React.createContext();

export default function App() {
  const [state, setState] = useState({
    data: data,
    cart: [],
    removebg: "",
    nav: 0,
    fileObject: ""
  });
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [file, setfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [nav, setNav] = useState(0);
  const setnav = (value) => {
    setState({
      ...state,
      nav: value
    });
  };
  const setmodal = (state) => {
    setmodalIsOpen(state);
  };

  const removebg = async (file) => {
    console.log({ app_removebg: "start" });
    setmodalIsOpen(true);
    const newPost = await createPost(file);
    setPosts((prev) => [newPost, ...prev]);

    setState({
      ...state,
      removebg: "data:image/png;base64," + newPost
    });
    setmodalIsOpen(false);
    return newPost;
  };

  const addToCart = (book) => {
    setmodalIsOpen(true);
    setState({
      ...state,
      removebg: book
    });
  };
  const addToStack = async (file_Object) => {
    // history.push('/cart');
    setfile(file_Object);
    setState({
      ...state,
      fileObject: file_Object
    });
    // setmodalIsOpen(false);
  };
  return (
    <BrowserRouter>
      <div>
        <Modal show={modalIsOpen}>
          <div>Loading</div>
        </Modal>
        <Routes>
          <Route
            path="/remove-background"
            element={
              <ContextData.Provider
                value={{
                  state: state,
                  addToCart,
                  removebg,
                  setPosts,
                  setmodal,
                  modalIsOpen,
                  setNav,
                  nav,
                  addToStack,
                  file
                }}
              >
                <RemoveBackground />
              </ContextData.Provider>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route
            path="/"
            element={
              <ContextData.Provider
                value={{
                  state: state,
                  addToCart,
                  removebg,
                  setPosts,
                  setmodal,
                  modalIsOpen,
                  setNav,
                  nav,
                  addToStack
                }}
              >
                <Home />
              </ContextData.Provider>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
*/
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate as useHistory } from 'react-router-dom';
import Modal from './Modal';
import './MainAppFrame.css';
import { createPost, useCachedCreatePost } from '../utils';

const Spinner = () => {
  document.body.classList.add('upload-loading');
  return <div>Loading</div>;
};

const MainAppFrame = () => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [receivedImage, setReceivedImage] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const refImage = useRef(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [elapsed_time_resize_mainframe, setElapsed_time_resize_mainframe] =
    useState(null);

  const handleDragOver = (event: { preventDefault: () => void }) => {
    setIsOverlayVisible(true);
    setmodalIsOpen(true);
    event.preventDefault();
  };

  const handleDrop = async (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    dataTransfer: { files: any };
  }) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length) {
      // onUpload(files);
      setPreviewImage(URL.createObjectURL(files[0]));
      setIsOverlayVisible(false);

      setmodalIsOpen(true);
      document.body.classList.add('upload-loading');
      createPost(files[0])
        .then((response) => {
          setElapsed_time_resize_mainframe(
            response.data.elapsed_time_resize_mainframe
          );
          setPreviewImage('data:image/png;base64,' + response.data.image);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setmodalIsOpen(false);
          document.body.classList.remove('upload-loading');
        });
    }
  };
  const handleDragEnter = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsOverlayVisible(true);
  };

  const preventDefaults = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const highlight = () => {
    setIsOverlayVisible(true);
  };

  const unHightLight = () => {
    setIsOverlayVisible(false);
  };

  useEffect(() => {
    if (!location.state?.image) {
      history('/', { state: { message: 'please chose a file' } });
    } else {
      setPreviewImage(URL.createObjectURL(location.state.image)); // Perform the API call
      setmodalIsOpen(true);
      document.body.classList.add('upload-loading');
      // const { data, loading, error } = useCachedCreatePost(location.state.image);

      const postToProxy = async () => {
        try {
          await createPost(location.state.image)
            .then((response) => {
              setElapsed_time_resize_mainframe(
                response.data.elapsed_time_resize_mainframe
              );
              setPreviewImage('data:image/png;base64,' + response.data.image);
            })
            .catch((error) => {
              setError(error.message);
            })
            .finally(() => {
              setmodalIsOpen(false);
              document.body.classList.remove('upload-loading');
            });
        } catch (err) {
          setError(err.message);
        }
      };

      // Call function immediately
      postToProxy();
    }

    const dropArea = document;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, unHightLight, false);
    });

    //dropArea.addEventListener('drop', handleDrop, false);

    return () => {
      const dropArea = document;
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unHightLight, false);
      });

      //dropArea.removeEventListener('drop', handleDrop, false);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage) {
        setPreviewImage(previewImage);
      }
      if (isOverlayVisible) {
        setIsOverlayVisible(isOverlayVisible);
      }
    };
  }, []);
  const handleUpload = async (e: { target: { files: any[] } }) => {
    setError(null); // Reset any previous errors
    // Show the loading spinner
    setmodalIsOpen(true);
    const file = e.target.files[0];
    try {
      if (!file) {
        setError('Please select an image');
      } else if (!file.type.startsWith('image')) {
        setError('Invalid file type. Please select an image file');
      } else if (file.size > 5000000) {
        setError('File is too large. Please select an image smaller than 5MB');
      } else {
        setPreviewImage(URL.createObjectURL(file));
        createPost(file)
          .then((response) => {
            setPreviewImage('data:image/png;base64,' + response.data.image);
          })
          .catch((error) => {
            setError(error.message);
          })
          .finally(() => {
            setmodalIsOpen(false);
          });
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred while uploading the image');
    } finally {
      setmodalIsOpen(false);
      // setIsSubmitting(false); // Hide the loading spinner
    }
  };

  const handleDownload = (event: { preventDefault: () => void }) => {
    // Download the received image
    event.preventDefault();
    const link = document.createElement('a');
    link.href = previewImage ? previewImage : '';
    link.download = 'image.jpg';
    link.click();
  };

  const handleBuy = (event: { preventDefault: () => void }) => {
    // Download the received image
    event.preventDefault();
    // Perform any necessary actions for purchasing the image, such as sending a request to a payment gateway // and updating the user's account //...
    history('/cart', { state: { image: receivedImage } });
  };
  const styles = {
    popup: {
      display: modalIsOpen ? 'inline-block' : 'none',
      opacity: modalIsOpen ? '1' : '0',
    },
    dragover: {
      display: isOverlayVisible ? 'block' : 'none',
      opacity: isOverlayVisible ? '1' : '0',
    },
  };

  return (
    <main id="page">
      <div className="container v2 container-main uploaded-container">
        <div className="uploaded-result_wrap">
          <div className="uploaded-result_image-wrap">
            <div className="uploaded-result_image">
              {previewImage && (
                <img
                  src={previewImage}
                  alt=""
                  id="my-image-without-background"
                />
              )}
              <img
                src={receivedImage}
                alt=""
                width="0"
                height="0"
                id="my-image-with-background"
                ref={refImage}
              />
              <div className="loading-spinner" style={styles.popup}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            {elapsed_time_resize_mainframe ? (
              <small>time : {elapsed_time_resize_mainframe}</small>
            ) : null}
            <br />
            <button id="report-issue-btn">AI did not work?</button>
            {error && (
              <p id="error-message" className="error">
                {' '}
                {error}{' '}
              </p>
            )}{' '}
          </div>
          <div className="uploaded-result_actions">
            <div className="uploaded-result_actions-block">
              <a href="#" className="btn med outline" onClick={handleDownload}>
                Download
              </a>
              <small>
                Preview Image <br />
                Low resolution
              </small>
            </div>
            <div className="uploaded-result_actions-block">
              <a href="#" className="btn med" onClick={handleBuy}>
                <svg
                  className="inline icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g>
                    <rect width="24" height="24" fill="none" />
                  </g>
                  <g transform="translate(1.592 5)">
                    <path
                      d="M19,3H5L2,9,12,21,22,9ZM9.62,8l1.5-3h1.76l1.5,3ZM11,10v6.68L5.44,10Zm2,0h5.56L13,16.68Zm6.26-2H16.61l-1.5-3h2.65ZM6.24,5H8.89L7.39,8H4.74Z"
                      transform="translate(-2 -3)"
                      fill="#ffffff"
                    />
                  </g>
                </svg>
                <span className="inline">Download HD</span>
              </a>
              <small>Full resolution image</small>
            </div>
            <div className="uploaded-result_desktop-block">
              <small>
                <a href="">Do more on the Desktop version</a>
              </small>
              <div className="uploaded-result_desktop-block_inner">
                <img
                  src="https://www.inpixio.com/rb-tool/assets/img/desktop-examples.png"
                  width="318"
                  height="90"
                  alt="Do more on the Desktop version"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="uploaded-legal">
          <small>
            By uploading an image you agree to our Terms of Service and{' '}
            <a href="/privacy-policy/" target="_blank">
              Privacy Policy
            </a>
            .
          </small>
        </div>
      </div>
      {modalIsOpen && (
        <div className="overlay">
          <Spinner />{' '}
        </div>
      )}
      <div
        id="dragover-overlay"
        className={`dragover-overlay ${isOverlayVisible ? 'over' : 'hide'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsOverlayVisible(false)}
        onDragEnter={handleDragEnter}
        style={styles.dragover}
      >
        <div className="dragover-overlay_wrap">
          <div className="dragover-overlay_inner">
            <img
              src="https://www.inpixio.com/rb-tool/assets/img/icon-file.svg"
              width="100"
              height="125"
              alt="Add Image Icon"
            />
            <h4 className="label">
              Drop one image <br />
              anywhere in the screen
            </h4>
          </div>
        </div>
      </div>
    </main>
  );
};
export default MainAppFrame;
