import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"

const useStyles = makeStyles(styles)

export default function HowToUse5() {
    const classes = useStyles();

    return (
        <div className={classes.container} style={{ backgroundColor: "#918166" }}>
            <div className={classes.section1}>
                <img className={classes.mainImg} src="/img/notification.png" alt="notification" />
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "#F7F2E9" }}>입출고 내역을 확인할 수 있습니다.</h2> 
                <p style={{ color: "#F7F2E9" }} className={classes.section2Content}>입출고 내역을 한 화면에서 확인할 수 있습니다.</p>
            </div>
        </div>
    )
}