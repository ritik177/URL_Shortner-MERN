import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, MenuItem, Alert, CircularProgress } from '@mui/material';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { getUrlsByTag, getAllUrls } from '../services/api';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await getAllUrls();
      if (response.success) {
        setUrls(response.data);
      }
    } catch (error) {
      setError('Error fetching URLs');
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
    // Extract unique tags from all URLs
    const tags = [...new Set(urls.flatMap(url => url.tags || []))];
    setAvailableTags(tags);
  }, [urls]);

  const handleUrlCreated = async (newUrl) => {
    try {
      // Fetch the complete URL data including analytics
      const response = await getUrlAnalytics(newUrl.shortUrl.split('/').pop());
      if (response.success) {
        setUrls(prev => [response.data, ...prev]);
      }
    } catch (error) {
      setError('Error fetching URL analytics');
      console.error('Error fetching URL analytics:', error);
    }
  };

  const handleTagFilter = async (tag) => {
    setSelectedTag(tag);
    setError('');
    setLoading(true);
    
    try {
      if (tag) {
        const response = await getUrlsByTag(tag);
        if (response.success) {
          setUrls(response.data);
        }
      } else {
        await fetchUrls();
      }
    } catch (error) {
      setError('Error fetching URLs by tag');
      console.error('Error fetching URLs by tag:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <UrlForm onUrlCreated={handleUrlCreated} />

      <Box sx={{ mb: 4 }}>
        <TextField
          select
          fullWidth
          label="Filter by Tag"
          value={selectedTag}
          onChange={(e) => handleTagFilter(e.target.value)}
          sx={{ maxWidth: 300 }}
        >
          <MenuItem value="">
            <em>All URLs</em>
          </MenuItem>
          {availableTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : urls.length > 0 ? (
        <UrlList urls={urls} />
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No URLs found. Create your first short URL above!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard; 