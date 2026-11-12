
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { useContext, useEffect, useRef } from "react";
import { QrResult } from "./contexts/qrContext";

export default function QrScanner() {
  const navigate = useNavigate();
  const { setResult } = useContext(QrResult);

  const scannerRef = useRef(null);
  const mountedRef = useRef(false);
  const startedRef = useRef(false);
  const scannedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let scanner = null;

    mountedRef.current = true;
    scannedRef.current = false;

    const cleanupScanner = async () => {
      if (!scanner) return;

      try {
        // Only stop if start() successfully completed
        if (startedRef.current) {
          await scanner.stop();
        }
      } catch (error) {
        // Ignore "not running" errors
        console.log("Scanner stop:", error);
      }

      try {
        scanner.clear();
      } catch (error) {
        console.log("Scanner clear:", error);
      }

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      startedRef.current = false;
    };

    const startScanner = async () => {
      try {
        /*
         * Create ONE scanner for this effect.
         */
        scanner = new Html5Qrcode("qr-reader");

        scannerRef.current = scanner;

        /*
         * Get cameras
         */
        const cameras = await Html5Qrcode.getCameras();

        /*
         * IMPORTANT:
         *
         * If StrictMode already cleaned up this effect,
         * do NOT continue starting the camera.
         */
        if (cancelled || !mountedRef.current) {
          await cleanupScanner();
          return;
        }

        if (!cameras || cameras.length === 0) {
          console.error("No camera found.");
          await cleanupScanner();
          return;
        }

        /*
         * Find rear camera
         */
        const rearCamera = cameras.find((camera) => {
          const label = camera.label.toLowerCase();

          return (
            label.includes("back") ||
            label.includes("rear") ||
            label.includes("environment")
          );
        });

        const selectedCamera = rearCamera || cameras[0];

        console.log(
          "Using camera:",
          selectedCamera.label || selectedCamera.id
        );

        /*
         * Start camera
         */
        await scanner.start(
          selectedCamera.id,
          {
            fps: 10,

            qrbox: {
              width: 250,
              height: 250,
            },
          },

          /*
           * QR SUCCESS
           */
          async (decodedText) => {
            if (cancelled) return;

            if (!decodedText) return;

            if (scannedRef.current) return;

            scannedRef.current = true;

            console.log("QR Code:", decodedText);

            setResult(decodedText);
            navigate("/FFinder")            /*
             * Stop this scanner
             */
            await cleanupScanner();

            /*
             * Go to result page
             */
            if (!cancelled && mountedRef.current) {
              navigate("/FFinder");
            }
          },

          /*
           * QR NOT FOUND
           */
          () => {
            // Don't log this.
            // This callback runs continuously.
          }
        );

        /*
         * start() finished successfully.
         */
        if (cancelled || !mountedRef.current) {
          await cleanupScanner();
          return;
        }

        startedRef.current = true;

        console.log("QR scanner started.");
      } catch (error) {
        console.error("QR scanner error:", error);

        await cleanupScanner();
      }
    };

    startScanner();

    /*
     * CLEANUP
     */
    return () => {
      console.log("QrScanner cleanup");

      cancelled = true;
      mountedRef.current = false;

      cleanupScanner();
    };
  }, [navigate, setResult]);

  return (
    <section id="qr">

      {/* HEADER */}
      <div className="headerContainer ffH">
        <div className="ImgAndTitleContainer">

          <ArrowLeft
            className="fArrow"
            onClick={() => navigate(-1)}
          />

          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Logo"
            className="Img1"
          />

          <h1 className="Title">
            Chatter
          </h1>

        </div>
      </div>

      {/* SCANNER */}
      <div className="scannerContainer">
        <div className="scanner">

          {/* ONLY ONE HTML5-QRCODE CONTAINER */}
          <div id="qr-reader"></div>

          {/* YOUR CUSTOM FRAME */}
          <div className="scanFrame"></div>

        </div>
      </div>

    </section>
  );
}

