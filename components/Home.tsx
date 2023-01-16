import React, { useEffect, useState } from 'react';
import { useNavigate as useHistory } from 'react-router-dom';

function Home() {
  const [image, setImage] = useState<File | null>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const history = useHistory();

  const preventDefaults = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragOver = (event: { preventDefault: () => void }) => {
    setIsOverlayVisible(true);
    event.preventDefault();
  };

  const handleFileUpload = (
    files: FileList | null,
    setError: (err: string) => void,
    setImage: (img: File) => void,
    history: any
  ) => {
    // const { files } = files;

    if (files && files.length > 0) {
      const file = files[0];
      try {
        if (!file) {
          setError('Please select an image');
        } else if (!file.type.startsWith('image')) {
          setError('Invalid file type. Please select an image file');
        } else if (file.size > 5000000) {
          setError(
            'File is too large. Please select an image smaller than 5MB'
          );
        } else {
          setImage(file); // Navigate to the processing route
          history('/remove-background', { state: { image: file } });
        }
      } catch (error) {
        console.log(error);
        setError('An error occurred while uploading the image');
      } finally {
        setIsSubmitting(false); // Hide the loading spinner
      }
    }
  };

  const handleDrop = async (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    dataTransfer: { files: any };
  }) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;
    handleFileUpload(files, setError, setImage, history);
  };

  const handleDragEnter = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsOverlayVisible(true);
  };
  const highlight = () => {
    setIsOverlayVisible(true);
  };

  const unHightLight = () => {
    setIsOverlayVisible(false);
  };

  const handleUpload = async (e: { target: { files: FileList | null } }) => {
    setError(null); // Reset any previous errors
    setIsSubmitting(true); // Show the loading spinner
    // const file = e.target?.files[0];
    const { files } = e.target;
    handleFileUpload(files, setError, setImage, history);
  };
  useEffect(() => {
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
  const Spinner = () => {
    document.body.classList.add('upload-loading');
    // useBodyClass(['upload-loading']);
    return (
      <div className="loading__overlay">
        <span></span>
      </div>
    );
  };
  const styles = {
    dragover: {
      display: isOverlayVisible ? 'block' : 'none',
      opacity: isOverlayVisible ? '1' : '0',
    },
  };
  return (
    <div>
      {' '}
      <main id="page">
        <div className="container v2 container-main flex">
          <div className="page-col_left">
            <h1>
              The <span>#1</span> One-Click Background Remover
            </h1>
            <img
              src="https://www.inpixio.com/remove-background/images/new/example.png"
              width="769"
              height="505"
              alt="Remove background"
            />
            <div className="ratings">
              <div className="rating">
                <a
                  href="https://www.trustpilot.com/review/inpixio.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    width="145"
                    height="68"
                    src="https://www.inpixio.com/remove-background/images/new/logo-trustpilot.svg"
                    alt="Trustpilot"
                  />
                </a>
              </div>
              <div className="rating">
                <a
                  href="https://www.capterra.com/p/213175/inPixio-Photo-Studio/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    width="145"
                    height="53"
                    src="https://www.inpixio.com/remove-background/images/new/logo-capterra.svg"
                    alt="Capterra"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="page-col_mid">
            <img
              src="https://www.inpixio.com/remove-background/images/new/icon-arrow.svg"
              width="150"
              height="80"
              alt="background eraser"
            />
          </div>
          <div className="page-col_right">
            <div className="loading">
              <div className="loading__wrap">
                <div className="c-upload">
                  <div className="c-upload__local">
                    <p className="c-upload__drag file-drop">
                      <img
                        src="https://www.inpixio.com/remove-background/images/new/icon-file.svg"
                        width="479"
                        height="277"
                        alt="Upload"
                      />
                    </p>
                    <div className="c-upload__choose">
                      <label className="upload__button">
                        <b className="plus"></b>
                        <span>UPLOAD YOUR PHOTO</span>

                        <input
                          type="file"
                          className="file-choose"
                          onChange={handleUpload}
                          disabled={isSubmitting}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <p>Or drag and drop a file</p>
                {error && (
                  <p id="error-message" className="error">
                    {' '}
                    {error}{' '}
                  </p>
                )}{' '}
              </div>
              {isSubmitting && <Spinner />}
            </div>
            <small>
              By uploading an image you agree to our Terms of Serviceand{' '}
              <a href="/privacy-policy/" target="_blank">
                Privacy Policy
              </a>
              .
            </small>
          </div>
        </div>
        <div
          id="dragover-overlay"
          className={`dragover-overlay ${isOverlayVisible ? 'over' : 'hide'}`}
          onDrop={handleDrop}
          // onDragOver={handleDragOver}
          onDragOver={enableDropping}
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
    </div>
  );
}
export default Home;
