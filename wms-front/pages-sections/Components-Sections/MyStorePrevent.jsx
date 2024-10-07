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
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(2),
  '& > *': {
    margin: theme.spacing(1),
    flex: '1 1 200px',
  },
}));

const CardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  flex: '1 1 calc(25% - 32px)',
  maxWidth: '300px',
  margin: theme.spacing(2),
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('lg')]: {
    flex: '1 1 calc(34% - 32px)',
  },
  [theme.breakpoints.down('md')]: {
    flex: '1 1 calc(50% - 32px)',
  },
  [theme.breakpoints.down('sm')]: {
    flex: '1 1 calc(100% - 32px)',
  },
}));

const Media = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%',
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
  maxHeight: '90vh',
  overflowY: 'hidden',
}));

const Video = styled('video')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  maxHeight: '75vh',
}));

const LoadingIndicator = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 1,
  color: theme.palette.grey[700],
  fontSize: '2rem',
}));

// 날짜를 기준으로 비디오 데이터를 내림차순 정렬
const sortVideosByDate = (videos) => {
  return [...videos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

let uniqueId = 0;
const generateDummyData = (count) => {
  return Array.from({ length: count }, () => {
    uniqueId++;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    const createdAt = date.toISOString();
    const anomalyCategory = uniqueId % 3 === 0 ? 'Intrusion' : null;
    return {
      pk: uniqueId,
      storeId: 1,
      videoUrl: `https://www.example.com/video${uniqueId}.mp4`,
      thumbnailUrl: `https://via.placeholder.com/400x225?text=Video${uniqueId}`,
      createdAt,
      anomalyCategory,
    };
  });
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
  const ITEMS_PER_PAGE = 20;

  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
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

  // 더미 데이터 생성 시 가장 최근 날짜순으로 정렬
  useEffect(() => {
    const storedVideos = localStorage.getItem('videos');
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos);
      setVideos(parsedVideos);
      setFilteredVideos(parsedVideos);
      setVisibleVideos(parsedVideos.slice(0, ITEMS_PER_PAGE));
    } else {
      const initialVideos = sortVideosByDate(generateDummyData(200)); // 200개의 더미 데이터를 생성
      setVideos(initialVideos);
      setFilteredVideos(initialVideos);
      setVisibleVideos(initialVideos.slice(0, ITEMS_PER_PAGE));
      localStorage.setItem('videos', JSON.stringify(initialVideos));
    }
  }, []);

  // videoId 쿼리 파라미터를 통해 모달을 자동으로 열기
  useEffect(() => {
    const { videoId } = router.query;
    if (videoId && videos.length > 0) {
      const videoToOpen = videos.find(video => video.pk === parseInt(videoId, 10));
      if (videoToOpen) {
        setSelectedVideo(videoToOpen);
        setOpen(true);
      } else {
        setSelectedVideo(null); // videoId가 변경되었지만 해당 비디오가 없는 경우 초기화
      }
    } else {
      setSelectedVideo(null); // videoId가 없을 때 초기화
    }
  }, [router.query.videoId, videos]); // videoId가 변경될 때마다 실행

  // 무한 로딩을 위한 IntersectionObserver 설정
  const lastVideoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // 페이지 증가
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // 페이지가 증가할 때마다 추가 데이터를 표시
  useEffect(() => {
    if (page === 0) return;
    const loadMoreVideos = () => {
      setLoading(true);
      const newVisibleVideos = filteredVideos.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE
      );
      setVisibleVideos((prevVisibleVideos) => [
        ...prevVisibleVideos,
        ...newVisibleVideos,
      ]);
      if (newVisibleVideos.length < ITEMS_PER_PAGE) {
        setHasMore(false); // 더 이상 로드할 데이터가 없으면 종료
      }
      setLoading(false);
    };
    loadMoreVideos();
  }, [page, filteredVideos]);

  // 필터 처리 함수
  const applyFilters = useCallback(() => {
    const filtered = videos.filter((video) => {
      const anomalyFilterPassed =
        filter === 'all'
          ? true
          : filter === 'anomaly'
          ? video.anomalyCategory !== null
          : video.anomalyCategory === null;

      const dateFilterPassed = dateFilter
        ? new Date(video.createdAt).toDateString() === new Date(dateFilter).toDateString()
        : true;

      return anomalyFilterPassed && dateFilterPassed;
    });
    setFilteredVideos(filtered);
    setVisibleVideos(filtered.slice(0, ITEMS_PER_PAGE)); // 필터링 후 첫 페이지의 비디오만 보여줌
    setPage(0); // 페이지를 0으로 리셋
    setHasMore(true); // 다시 무한 스크롤을 활성화
  }, [videos, filter, dateFilter]);

  useEffect(() => {
    applyFilters(); // 필터를 적용
  }, [filter, dateFilter, applyFilters]);

  const handleOpen = useCallback(
    (video) => {
      setSelectedVideo(video);
      setOpen(true);
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
    setSelectedVideo(null); // 모달을 닫을 때 selectedVideo 초기화
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
    setVideos((prevVideos) => prevVideos.filter((video) => video.pk !== pk));
    setFilteredVideos((prevFilteredVideos) =>
      prevFilteredVideos.filter((video) => video.pk !== pk)
    );
    setVisibleVideos((prevVisibleVideos) =>
      prevVisibleVideos.filter((video) => video.pk !== pk)
    );
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
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  return (
    <PageContainer>
      <HeaderPlaceholder></HeaderPlaceholder>
      <Container>
        <FilterContainer>
          <FormControl variant="outlined">
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
            label="날짜 필터"
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
        </FilterContainer>
        <CardContainer>
          {visibleVideos.map((video, index) => (
            <div
              key={video.pk}
              ref={index === visibleVideos.length - 1 ? lastVideoElementRef : null}
            >
              <VideoCard video={video} onOpen={handleOpen} onDelete={handleDelete} />
            </div>
          ))}
        </CardContainer>
        {loading && <LoadingIndicator>Loading...</LoadingIndicator>}
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <ModalContent>
            {selectedVideo && (
              <>
                <CloseButton onClick={handleClose}>
                  <CloseIcon fontSize="large" />
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
        <Dialog open={deleteVideoId !== null} onClose={cancelDelete}>
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