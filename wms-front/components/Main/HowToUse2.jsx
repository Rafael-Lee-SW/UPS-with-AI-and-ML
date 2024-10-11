import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"
import { useEffect, useRef } from "react";

const useStyles = makeStyles(styles)

export default function HowToUse2() {
    const classes = useStyles();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    return (
        <div className={classes.container} style={{ backgroundColor: "#e6f4fa" }}>
            <div className={classes.section1}>
                <video
                    className={classes.video}
                    src="/video/location1.mp4"
                    ref={videoRef}
                    muted
                    loop
                ></video>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "black" }}>구조를 설정합니다.</h2> 
                <p style={{ color: "black" }} className={classes.section2Content}>크기, 층, 그리고 이름까지</p>
                <p style={{ color: "black" }} className={classes.section2Content}>원하는대로 설정할 수 있습니다.</p>
            </div>
        </div>
    )
}