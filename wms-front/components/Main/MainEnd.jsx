import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/mainEndStyle.js"

const useStyles = makeStyles(styles)

export default function HowToUseStart() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <p className={classes.title}>지금, Auto-Store와 함께 시작하세요</p>
            <Link href="/404">
                <button className={classes.button}>구매하기</button>
            </Link>
        </div>
    )
}