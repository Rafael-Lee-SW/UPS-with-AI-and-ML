import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/serviceInfo3Style.js"

const useStyles = makeStyles(styles)

export default function serviceInfo3 () {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.section1}>
                <h2 className={classes.title}>매장을 안전하게</h2>
                <p className={classes.content}>Auto-Store는 AI를 사용해 매장을 관리합니다.</p>
                <p className={classes.content}>이상행동을 탐지하여 안전한 매장을 만듭니다.</p>
            </div>
            <div className={classes.section2}>
                <img className={classes.mainImg} src="/img/mainInfo1.png" alt="mainInfo"/>
            </div>
        </div>
    )
}