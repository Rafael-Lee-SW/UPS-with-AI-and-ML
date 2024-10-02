import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router'; // Next.js의 useRouter 사용
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    paddingTop: '50px',
  },
  headerPlaceholder: {
    height: '50px',
    width: '100%',
    backgroundColor: theme.palette.grey[200],
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    maxWidth: '1200px',
    margin: '0 auto',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '400px', // 고정된 너비로 수정
    margin: theme.spacing(2),
    position: 'relative',
  },
  media: {
    height: 200, // 높이 조정
  },
  anomaly: {
    backgroundColor: 'red',
    color: 'white',
    padding: theme.spacing(1),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  modalContent: {
    width: '80%',
    maxWidth: '800px',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    padding: theme.spacing(2),
    outline: 'none',
  },
  video: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  loadingIndicator: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

let uniqueId = 0;
const generateDummyData = (count, filter, dateFilter) => {
  return Array.from({ length: count }, () => {
    uniqueId++;
    // 최근 30일 내의 랜덤 날짜 생성
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const createdAt = date.toISOString();
    const anomalyCategory = uniqueId % 3 === 0 ? 'Intrusion' : null;

    // 필터 적용
    const anomalyFilterPassed =
      filter === 'all'
        ? true
        : filter === 'anomaly'
        ? anomalyCategory !== null
        : filter === 'normal'
        ? anomalyCategory === null
        : true;

    const dateFilterPassed = dateFilter
      ? new Date(createdAt).toDateString() === new Date(dateFilter).toDateString()
      : true;

    if (anomalyFilterPassed && dateFilterPassed) {
      return {
        pk: uniqueId,
        storeId: 1,
        videoUrl: `https://www.example.com/video${uniqueId}.mp4`,
        thumbnailUrl: `https://via.placeholder.com/400x200?text=Video${uniqueId}`,
        createdAt,
        anomalyCategory,
      };
    } else {
      return null;
    }
  }).filter(Boolean);
};

const VideoCard = React.memo(({ video, onOpen, onDelete }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} onClick={() => onOpen(video)}>
      {video.anomalyCategory && (
        <div className={classes.anomaly}>{video.anomalyCategory}</div>
      )}
      <CardMedia
        className={classes.media}
        image={video.thumbnailUrl}
        title="CCTV Thumbnail"
      />
      <CardContent>
        <p>CCTV 시간: {new Date(video.createdAt).toLocaleString()}</p>
        <IconButton
          style={{ position: 'absolute', top: 10, right: 10 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.pk);
          }}
        >
          <CloseIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
});

const MyStorePrevent = () => {
  const classes = useStyles();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleteVideoId, setDeleteVideoId] = useState(null);

  const router = useRouter();

  const observer = useRef();
  const lastVideoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    loadMoreVideos();
  }, [page, filter, dateFilter]);

  useEffect(() => {
    // URL에서 videoId 파라미터를 확인하여 모달을 열어줍니다.
    const { videoId } = router.query;
    if (videoId && videos.length > 0) {
      const video = videos.find((v) => v.pk === parseInt(videoId));
      if (video) {
        setSelectedVideo(video);
        setOpen(true);
      }
    }
  }, [router.query, videos]);

  const loadMoreVideos = () => {
    setLoading(true);
    setTimeout(() => {
      const newVideos = generateDummyData(20, filter, dateFilter);
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      }
      setLoading(false);
    }, 1000);
  };

  const handleOpen = useCallback(
    (video) => {
      setSelectedVideo(video);
      setOpen(true);
      // URL에 videoId 추가
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, videoId: video.pk },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedVideo(null);
    // URL에서 videoId 제거
    const { videoId, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  }, [router]);

  const handleDelete = useCallback((pk) => {
    setDeleteVideoId(pk);
  }, []);

  const confirmDelete = () => {
    const pk = deleteVideoId;
    setDeleteVideoId(null);
    // API 호출 시뮬레이션
    setVideos((prevVideos) => prevVideos.filter((video) => video.pk !== pk));
    toast.success('삭제가 완료되었습니다.');

    if (selectedVideo && selectedVideo.pk === pk) {
      setOpen(false);
      setSelectedVideo(null);
    }
  };

  const cancelDelete = () => {
    setDeleteVideoId(null);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    resetVideos();
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    resetVideos();
  };

  const resetVideos = () => {
    setPage(0);
    setVideos([]);
    setHasMore(true);
    // 필터가 변경될 때마다 데이터를 다시 로드하기 위해 page를 변경
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.headerPlaceholder}></div>
      <div className={classes.container}>
        <div className={classes.filterContainer}>
          <Select value={filter} onChange={handleFilterChange}>
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="anomaly">이상 감지</MenuItem>
            <MenuItem value="normal">정상</MenuItem>
          </Select>
          <TextField
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className={classes.cardContainer}>
          {videos.map((video, index) => (
            <div
              key={video.pk}
              ref={index === videos.length - 1 ? lastVideoElementRef : null}
            >
              <VideoCard video={video} onOpen={handleOpen} onDelete={handleDelete} />
            </div>
          ))}
        </div>
        {loading && <div className={classes.loadingIndicator}>Loading...</div>}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
        >
          <div className={classes.modalContent}>
            {selectedVideo && (
              <>
                <IconButton className={classes.closeButton} onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
                <video className={classes.video} controls autoPlay>
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {selectedVideo.anomalyCategory && (
                  <p>이상 감지: {selectedVideo.anomalyCategory}</p>
                )}
              </>
            )}
          </div>
        </Dialog>
        <Dialog
          open={deleteVideoId !== null}
          onClose={cancelDelete}
        >
          <DialogTitle>해당 CCTV 영상을 삭제하시겠습니까?</DialogTitle>
          <DialogActions>
            <Button onClick={cancelDelete}>아니오</Button>
            <Button onClick={confirmDelete} color="primary">
              예
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default MyStorePrevent;
