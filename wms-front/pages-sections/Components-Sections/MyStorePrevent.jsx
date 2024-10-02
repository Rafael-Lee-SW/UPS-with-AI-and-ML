import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';

const PageContainer = styled('div')(({ theme }) => ({
  paddingTop: '50px',
  width: '100%',
}));

const HeaderPlaceholder = styled('div')(({ theme }) => ({
  height: '50px',
  width: '100%',
  backgroundColor: theme.palette.grey[200],
}));

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
}));

const FilterContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const CardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '400px',
  margin: theme.spacing(2),
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[4],
  },
}));

const Media = styled(CardMedia)(({ theme }) => ({
  height: 200,
}));

const Anomaly = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  position: 'absolute',
  top: 0,
  left: 0,
}));

const ModalContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  padding: theme.spacing(2),
  outline: 'none',
}));

const Video = styled('video')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
}));

const LoadingIndicator = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
}));

const useStyles = {
  selectField: {
    flex: 1,
    marginRight: '16px',
  },
  dateField: {
    flex: 1,
  },
};

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
  return (
    <StyledCard onClick={() => onOpen(video)}>
      {video.anomalyCategory && <Anomaly>{video.anomalyCategory}</Anomaly>}
      <Media image={video.thumbnailUrl} title="CCTV Thumbnail" />
      <CardContent>
        <p>CCTV 시간: {new Date(video.createdAt).toLocaleString()}</p>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.pk);
          }}
          style={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </CardContent>
    </StyledCard>
  );
});

const MyStorePrevent = () => {
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
    uniqueId = 0; // uniqueId 초기화
  };

  return (
    <PageContainer>
      <HeaderPlaceholder></HeaderPlaceholder>
      <Container>
        <FilterContainer>
          <FormControl style={useStyles.selectField}>
            <InputLabel id="filter-label">필터</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              label="필터"
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="anomaly">이상 감지</MenuItem>
              <MenuItem value="normal">정상</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            style={useStyles.dateField}
          />
        </FilterContainer>
        <CardContainer>
          {videos.map((video, index) => (
            <div
              key={video.pk}
              ref={index === videos.length - 1 ? lastVideoElementRef : null}
            >
              <VideoCard video={video} onOpen={handleOpen} onDelete={handleDelete} />
            </div>
          ))}
        </CardContainer>
        {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
        >
          <ModalContent>
            {selectedVideo && (
              <>
                <CloseButton onClick={handleClose}>
                  <CloseIcon />
                </CloseButton>
                <Video controls autoPlay>
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </Video>
                {selectedVideo.anomalyCategory && (
                  <p>이상 감지: {selectedVideo.anomalyCategory}</p>
                )}
              </>
            )}
          </ModalContent>
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
      </Container>
    </PageContainer>
  );
};

export default MyStorePrevent;
