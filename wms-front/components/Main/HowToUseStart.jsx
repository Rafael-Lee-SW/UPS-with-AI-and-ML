import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStartStyle.js"

const useStyles = makeStyles(styles)

export default function HowToUseStart() {
    const classes = useStyles();

    return (
        <div id="how-to-use-start" className={classes.container} style={{ backgroundColor: "white" }}>
            <img className={classes.img} src="/img/logo1.png" alt="logo"/>
            <p className={classes.title}>Fit-Box 이용 가이드</p>
        </div>
    )
}