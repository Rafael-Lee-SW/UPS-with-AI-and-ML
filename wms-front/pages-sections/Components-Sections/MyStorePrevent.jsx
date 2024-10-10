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
import { fetchCrimeVideos, updateCrimeNotifications } from '../../pages/api/index';

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
  height: 'auto',
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
  paddingTop: '100%', // 1:1 비율
  backgroundSize: 'contain', // 이미지가 영역 내에 맞게 조정됩니다
  backgroundPosition: 'center', // 이미지를 중앙에 위치시킵니다
  // backgroundColor: theme.palette.grey[200], // 배경색을 추가하여 이미지가 없는 영역을 채웁니다
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

const getThumbnailUrl = (category) => {
  switch (category) {
    case '절도':
      return '/img/thumbnails/theft_icon.png';
    case '파손':
      return '/img/thumbnails/breaking_icon.png';
    case '흡연':
      return '/img/thumbnails/smoking_icon.png';
    case '방화':
      return '/img/thumbnails/arson_icon.png';
    case '실신':
      return '/img/thumbnails/fainting_icon.png';
    default:
      return '/img/thumbnails/default_icon.png';
  }
};

const VideoCard = React.memo(({ video, onOpen, onDelete, onToggleFavorite }) => {
  return (
    <StyledCard onClick={() => onOpen(video)}>
      <CardActions>
        <FavoriteButton
          isFavorite={video.isImportant}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(video);
          }}
        >
          {video.isImportant ? <StarIcon /> : <StarBorderIcon />}
        </FavoriteButton>
        <DeleteButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.notificationId);
          }}
        >
          <CloseIcon />
        </DeleteButton>
      </CardActions>
      <Media image={getThumbnailUrl(video.category)} title={`${video.category} Thumbnail`} />
      <StyledCardContent>
        <CCTVTime>CCTV 시간: {new Date(video.createdDate).toLocaleString()}</CCTVTime>
      </StyledCardContent>
    </StyledCard>
  );
});

const MyStorePrevent = ({ storeId, storeTitle }) => {
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

  const sortVideosByDate = (videos) => {
    return videos.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  };

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetchCrimeVideos(storeId);
        if (response.data && response.data.success) {
          const fetchedVideos = response.data.result;
          const sortedVideos = sortVideosByDate(fetchedVideos);
          setVideos(sortedVideos);
          setFilteredVideos(sortedVideos);
          setVisibleVideos(sortedVideos.slice(0, ITEMS_PER_PAGE));
        } else {
          console.error('Failed to fetch videos:', response);
          toast.error('비디오를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('비디오를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [storeId]);

  useEffect(() => {
    const { videoId } = router.query;
    if (videoId && videos.length > 0) {
      const videoToOpen = videos.find(video => video.notificationId === parseInt(videoId, 10));
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
      const categoryFilterPassed =
        filter === 'all'
          ? true
          : video.category === filter;

      const dateFilterPassed = dateFilter
        ? new Date(video.createdDate).toDateString() === new Date(dateFilter).toDateString()
        : true;

      return categoryFilterPassed && dateFilterPassed;
    });
    const sortedFiltered = sortVideosByDate(filtered);
    setFilteredVideos(sortedFiltered);
    setVisibleVideos(sortedFiltered.slice(0, ITEMS_PER_PAGE));
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
          query: { ...router.query, videoId: video.notificationId },
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

  const handleDelete = useCallback((notificationId) => {
    setDeleteVideoId(notificationId);
  }, []);

  const confirmDelete = () => {
    const notificationId = deleteVideoId;
    setDeleteVideoId(null);
    setVideos((prevVideos) => prevVideos.filter((video) => video.notificationId !== notificationId));
    setFilteredVideos((prevFilteredVideos) =>
      prevFilteredVideos.filter((video) => video.notificationId !== notificationId)
    );
    setVisibleVideos((prevVisibleVideos) =>
      prevVisibleVideos.filter((video) => video.notificationId !== notificationId)
    );
    toast.success('삭제가 완료되었습니다.');
    if (selectedVideo && selectedVideo.notificationId === notificationId) {
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

  const toggleFavorite = useCallback(async (video) => {
    try {
      await updateCrimeNotifications([
        { notificationId: video.notificationId, isRead: video.isRead, isImportant: !video.isImportant }
      ]);
      setVideos(prevVideos => 
        prevVideos.map(v => 
          v.notificationId === video.notificationId ? { ...v, isImportant: !v.isImportant } : v
        )
      );
      setFilteredVideos(prevFilteredVideos => 
        prevFilteredVideos.map(v => 
          v.notificationId === video.notificationId ? { ...v, isImportant: !v.isImportant } : v
        )
      );
      setVisibleVideos(prevVisibleVideos => 
        prevVisibleVideos.map(v => 
          v.notificationId === video.notificationId ? { ...v, isImportant: !v.isImportant } : v
        )
      );
      toast.success(video.isImportant ? '중요 표시가 해제되었습니다.' : '중요 표시되었습니다.');
    } catch (error) {
      console.error('Failed to update notification:', error);
      toast.error('중요 표시 업데이트에 실패했습니다.');
    }
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
              key={video.notificationId}
              ref={index === visibleVideos.length - 1 ? lastVideoElementRef : null}
            >
              <VideoCard 
                video={video} 
                onOpen={handleOpen} 
                onDelete={handleDelete}
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
                  <source src={selectedVideo.url} type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </Video>
                <p>카테고리: {selectedVideo.category}</p>
                <p>생성 시간: {new Date(selectedVideo.createdDate).toLocaleString()}</p>
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