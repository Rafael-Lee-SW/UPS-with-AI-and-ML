import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"
import { useEffect, useRef } from "react";

const useStyles = makeStyles(styles)

export default function HowToUse4() {
    const classes = useStyles();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    return (
        <div className={classes.container} style={{ backgroundColor: "#DEBF8A" }}>
            <div className={classes.section1}>
                <video
                    className={classes.video}
                    src="/video/import.mp4"
                    ref={videoRef}
                    muted
                    loop
                ></video>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "#54462E" }}>입고/출고 처리를 합니다.</h2> 
                <p style={{ color: "#54462E" }} className={classes.section2Content}>엑셀 파일 업로드로 손쉬운 입/출고 처리가 가능합니다.</p>
                <p style={{ color: "#54462E" }} className={classes.section2Content}>검색과 프린트 기능도 제공합니다.</p>
            </div>
        </div>
    )
}