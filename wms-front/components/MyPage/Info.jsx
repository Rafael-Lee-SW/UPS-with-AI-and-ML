import { makeStyles } from "@material-ui/core";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/infoStyle.js";

const useStyles = makeStyles(styles)

// 회원정보 랜더링
export default function Info({ name, email, nickname, roleTypeEnum, businessId, businessName, businessNumber, createdDate }) {
    
    const classes = useStyles();
    const initialUserInfo = { name, email, nickname, roleTypeEnum, businessId, businessName, businessNumber, createdDate } 

    const formattedDate = initialUserInfo.createdDate ? initialUserInfo.createdDate.substring(0, 10) : '';

    return (
      <div>
        <h3>{name}님, 반갑습니다.</h3>
          <div className={classes.container}>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이름</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.name}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>닉네임</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.nickname}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이메일</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.email}</td>
                </tr>
                {roleTypeEnum === 'BUSINESS' && (
                <>
                <tr>
                  <td className={classes.labelCell}>
                    <strong className={classes.text}>사업자 이름</strong>
                  </td>
                  <td className={classes.valueCell}>{initialUserInfo.businessName}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}>
                    <strong className={classes.text}>사업자 번호</strong>
                  </td>
                  <td className={classes.valueCell}>{initialUserInfo.businessNumber}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}>
                    <strong className={classes.text}>가입 일자</strong>
                  </td>
                  <td className={classes.valueCell}>{formattedDate}</td>
                </tr>
                </>
              )}
              </tbody>
            </table>
          </div>
      </div>
    )
}
