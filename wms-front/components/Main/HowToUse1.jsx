import { makeStyles } from "@material-ui/core";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js";
import { useEffect, useRef } from "react";

const useStyles = makeStyles(styles);

export default function HowToUse1() {
    const classes = useStyles();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    return (
        <div className={classes.container} style={{ backgroundColor: "#E2DFD7" }}>
            <div className={classes.section1}>
                <video
                    className={classes.video}
                    src="/video/warehouse1.mp4"
                    ref={videoRef}
                    muted
                    loop
                ></video>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "#4E4544" }}>
                    창고를 생성합니다.
                </h2>
                <p style={{ color: "#4E4544" }} className={classes.section2Content}>
                    구매한 창고 개수만큼 생성할 수 있어요.
                </p>
            </div>
        </div>
    );
}
