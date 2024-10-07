import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Card,
  CardContent as MuiCardContent,
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
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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
  height: '220px',
  display: 'flex',
  flexDirection: 'column',
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
  paddingTop: '56.25%', // 16:9 비율
}));

const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
}));

const CCTVTime = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
}));

const CardActions = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  zIndex: 1,
}));

const FavoriteButton = styled(IconButton)(({ theme, isFavorite }) => ({
  color: isFavorite ? theme.palette.warning.main : theme.palette.grey[500],
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const Anomaly = styled('div')(({ theme, backgroundColor }) => ({
  backgroundColor: backgroundColor,
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1),
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  textAlign: 'center',
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

const sortVideosByDate = (videos) => {
  return [...videos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

let uniqueId = 0;

const generateDummyData = (count) => {
  const categories = ['절도', '파손', '흡연', '방화', '실신'];
  return Array.from({ length: count }, () => {
    uniqueId++;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    const createdAt = date.toISOString();
    const anomalyCategory = categories[Math.floor(Math.random() * categories.length)];
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

const VideoCard = React.memo(({ video, onOpen, onDelete, isFavorite, onToggleFavorite }) => {
  const getAnomalyColor = (category) => {
    switch (category) {
      case '절도':
        return '#f44336';
      case '파손':
        return '#ff9800';
      case '흡연':
        return '#4caf50';
      case '방화':
        return '#2196f3';
      case '실신':
        return '#9c27b0';
    }
  };

  return (
    <StyledCard onClick={() => onOpen(video)}>
      <CardActions>
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(video.pk);
          }}
        >
          {isFavorite ? <StarIcon /> : <StarBorderIcon />}
        </FavoriteButton>
        <DeleteButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.pk);
          }}
        >
          <CloseIcon />
        </DeleteButton>
      </CardActions>
      <Media image={video.thumbnailUrl} title="CCTV Thumbnail" />
      <StyledCardContent>
        <CCTVTime>CCTV 시간: {new Date(video.createdAt).toLocaleString()}</CCTVTime>
      </StyledCardContent>
      {video.anomalyCategory && (
        <Anomaly backgroundColor={getAnomalyColor(video.anomalyCategory)}>
          {video.anomalyCategory}
        </Anomaly>
      )}
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
  const [favorites, setFavorites] = useState(new Set());
  const router = useRouter();
  const observer = useRef();

  useEffect(() => {
    const storedVideos = localStorage.getItem('videos');
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos);
      setVideos(parsedVideos);
      setFilteredVideos(parsedVideos);
      setVisibleVideos(parsedVideos.slice(0, ITEMS_PER_PAGE));
    } else {
      const initialVideos = sortVideosByDate(generateDummyData(200));
      setVideos(initialVideos);
      setFilteredVideos(initialVideos);
      setVisibleVideos(initialVideos.slice(0, ITEMS_PER_PAGE));
      localStorage.setItem('videos', JSON.stringify(initialVideos));
    }
  }, []);

  useEffect(() => {
    const { videoId } = router.query;
    if (videoId && videos.length > 0) {
      const videoToOpen = videos.find(video => video.pk === parseInt(videoId, 10));
      if (videoToOpen) {
        setSelectedVideo(videoToOpen);
        setOpen(true);
      } else {
        setSelectedVideo(null);
      }
    } else {
      setSelectedVideo(null);
    }
  }, [router.query.videoId, videos]);

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
        setHasMore(false);
      }
      setLoading(false);
    };
    loadMoreVideos();
  }, [page, filteredVideos]);

  const applyFilters = useCallback(() => {
    const filtered = videos.filter((video) => {
      const anomalyFilterPassed =
        filter === 'all'
          ? true
          : video.anomalyCategory === filter;

      const dateFilterPassed = dateFilter
        ? new Date(video.createdAt).toDateString() === new Date(dateFilter).toDateString()
        : true;

      return anomalyFilterPassed && dateFilterPassed;
    });
    setFilteredVideos(filtered);
    setVisibleVideos(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(0);
    setHasMore(true);
  }, [videos, filter, dateFilter]);

  useEffect(() => {
    applyFilters();
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
    setSelectedVideo(null);
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

  const toggleFavorite = useCallback((pk) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(pk)) {
        newFavorites.delete(pk);
      } else {
        newFavorites.add(pk);
      }
      return newFavorites;
    });
  }, []);

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
                              <MenuItem value="절도">절도</MenuItem>
               <MenuItem value="파손">파손</MenuItem>
               <MenuItem value="흡연">흡연</MenuItem>
               <MenuItem value="방화">방화</MenuItem>
               <MenuItem value="실신">실신</MenuItem>
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
              <VideoCard 
                video={video} 
                onOpen={handleOpen} 
                onDelete={handleDelete}
                isFavorite={favorites.has(video.pk)}
                onToggleFavorite={toggleFavorite}
              />
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
                  브라우저가 비디오를 지원하지 않습니다.
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