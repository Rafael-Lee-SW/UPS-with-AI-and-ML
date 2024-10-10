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
        <div className={classes.container} style={{ backgroundColor: "#e6f4fa" }}>
            <div className={classes.section1}>
                <video
                    className={classes.video}
                    src="/video/device.mp4"
                    ref={videoRef}
                    muted
                    loop
                ></video>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "black" }}>기기 등록, otp 발급</h2> 
                <p style={{ color: "black" }} className={classes.section2Content}>OTP를 통해 키오스크를 등록합니다.</p>
                <p style={{ color: "black" }} className={classes.section2Content}>cctv도 등록 및 삭제 할 수 있어요.</p>
            </div>
        </div>
    )
}