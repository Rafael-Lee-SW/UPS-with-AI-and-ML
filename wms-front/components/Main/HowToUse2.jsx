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
        <div className={classes.container} style={{ backgroundColor: "#D6CABA" }}>
            <div className={classes.section1}>
                <video
                    className={classes.video}
                    src="/video/location.mp4"
                    ref={videoRef}
                    muted
                    loop
                ></video>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "#594933" }}>로케이션을 생성합니다.</h2> 
                <p style={{ color: "#594933" }} className={classes.section2Content}>크기, 층, 그리고 이름까지</p>
                <p style={{ color: "#594933" }} className={classes.section2Content}>원하는대로 설정할 수 있습니다.</p>
            </div>
        </div>
    )
}