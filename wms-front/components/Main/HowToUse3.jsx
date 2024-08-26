import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"
import { useEffect, useRef } from "react";

const useStyles = makeStyles(styles)

export default function HowToUse3() {
    const classes = useStyles();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    return (
        <div className={classes.container} style={{ backgroundColor: "#ADAAA5" }}>
            <div className={classes.section1}>
                <video
                    className={classes.video}
                    src="/video/wall.mp4"
                    ref={videoRef}
                    muted
                    loop
                ></video>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "black" }}>벽을 생성합니다.</h2> 
                <p style={{ color: "black" }} className={classes.section2Content}>이동은 물론, 벽과 특수객체까지 추가할 수 있어요.</p>
            </div>
        </div>
    )
}