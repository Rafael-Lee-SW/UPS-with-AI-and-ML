import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Input, Card, InputAdornment } from '@material-ui/core';
import { deleteBusinessEmployee, addEmployeeToBusiness, fetchEmployeeByEmail, fetchBusinessEmployees } from '../../pages/api';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/pages/componentsSections/manageEmployeesStyle.js';
import { useRouter } from 'next/router';
import Image from 'next/image';

const useStyles = makeStyles(style);

export default function ManageEmployees({ businessId }) {
    const classes = useStyles();
    const router = useRouter();
    const [detailOpen, setDetailOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, [searchResults]);

    // 현재 직원 목록 
    const fetchEmployees = async () => {
        try {
            const response = await fetchBusinessEmployees(businessId); 
            const result = response.data.result;

            const filteredEmployees = result.filter(employee => employee.roleTypeEnum === 'EMPLOYEE');
            setEmployees(filteredEmployees)

        } catch (error) {
            router.push('/404');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetchEmployeeByEmail(searchEmail);
            const result = response.data.result;

            if ( result && result.businessId !== businessId ) {
                setSearchResults(result);
            } else {
                setSearchResults(null);
            }

        } catch (error) {
            router.push('/404');
            setSearchResults(null);
        }
    };

    const handleAddEmployee = async (employeeId) => {
        try {
            await addEmployeeToBusiness(businessId, employeeId);
            setSearchResults(null);
            setSearchEmail('');
            setTitle('직원 추가');
            setMessage('직원이 추가되었습니다.');
            handleModalOpen();
            fetchEmployees();
        } catch (error) {
            router.push('/404');
        }
    };

    const handleDelete = async (employeeId, event) => {
    event.stopPropagation();
    try {
        await deleteBusinessEmployee(employeeId, businessId);
        setTitle('직원 삭제');
        setMessage('직원이 삭제되었습니다.');
        handleModalOpen();
        fetchEmployees(); 
    } catch (error) {
        router.push('/404');
    }
};

    const handleDetailOpen = (employee) => {
        setCurrentEmployee(employee);
        setDetailOpen(true);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleDetailClose = () => {
        setOpen(false);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div className={classes.container}>
            <h3>직원 관리</h3>

            {/* 검색 폼 */}
            <div className={classes.searchContainer}>
                
                <Input
                    type="email"
                    placeholder="직원 이메일 검색"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className={classes.input}
                    startAdornment={
                        <InputAdornment position="start">
                            <Image src="/img/mailIconBk.png" alt="Mail Icon" width={20} height={20} />
                        </InputAdornment>
                    }
                />
                <button onClick={handleSearch} className={classes.Button}>
                    검색
                </button>
            </div>

            {/* 검색 결과 목록 */}
            <div className={classes.resultContainer}>
                {searchResults ? (
                    <card className={classes.card}>
                        <div>{searchResults.email}</div>
                        <button onClick={() => handleAddEmployee(searchResults.id)} className={classes.button}>
                            추가
                        </button>
                    </card>
                ) : (
                    <div>검색 결과가 없습니다.</div>
                )}
            </div>
            {/* 현재 직원 목록 */}
            <h4 className={classes.listTitle}>직원 목록</h4>
            <div className={classes.listContainer}>
                {employees ? (
                    employees.map((employee) => (
                        <Card key={employee.id} className={classes.listCard}>
                            <div className={classes.nameDiv} onClick={() => handleDetailOpen(employee)}>{employee.name}</div>
                            <button onClick={(e) => handleDelete(employee.id, e)} className={classes.button}>
                                삭제
                            </button>
                        </Card>
                    ))
                ) : (
                  <div></div>
                )

                }
            </div>

            {/* 직원 상세 정보 모달 */}
            <Dialog open={detailOpen} onClose={handleDetailClose}>
                <div className={classes.modalTitle}><DialogTitle>직원 상세 정보</DialogTitle></div>
                <DialogContent>
                    {currentEmployee && (
                        <>
                            <p>이름: {currentEmployee.name}</p>
                            <p>이메일: {currentEmployee.email}</p>
                            <p>등록일: {currentEmployee.businessAddDate}</p>
                        </>
                    )}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'flex-end' }}>
                    <button className={classes.modalCloseButton} onClick={handleDetailClose} color="primary">
                        X
                    </button>
                </DialogActions>
            </Dialog>
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <div className={classes.modalTitle}><DialogTitle>{title}</DialogTitle></div>
                <DialogContent>
                    <>
                    <p>{message}</p>
                    </>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'flex-end' }}>
                <button className={classes.modalCloseButton} onClick={handleModalClose}>
                    X
                </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

